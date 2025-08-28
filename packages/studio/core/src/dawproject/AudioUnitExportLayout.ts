import {AudioBusBox, AudioUnitBox} from "@opendaw/studio-boxes"
import {ArrayMultimap, asInstanceOf, isDefined, isInstanceOf, Nullable, Option} from "@opendaw/lib-std"
import {AudioUnitType} from "@opendaw/studio-enums"
import {DeviceBoxUtils} from "@opendaw/studio-adapters"

/**
 * Utilities for arranging {@link AudioUnitBox} connections into tracks for
 * export. The resulting structure reflects how audio flows between units.
 */
export namespace AudioUnitExportLayout {
    /** Recursive track representation used during export. */
    export interface Track {
        audioUnit: AudioUnitBox
        children: Array<Track>
    }

    /**
     * Build a hierarchy of tracks from the current set of audio units.
     *
     * @param audioUnits - All audio unit boxes to arrange.
     * @returns Ordered track hierarchy describing the signal flow.
     */
    export const layout = (audioUnits: ReadonlyArray<AudioUnitBox>): Array<Track> => {
        const feedsInto = new ArrayMultimap<AudioUnitBox, AudioUnitBox>()
        audioUnits.forEach(unit => {
            unit.output.targetVertex.ifSome(({box}) => {
                if (isInstanceOf(box, AudioBusBox)) {
                    box.output.targetVertex.ifSome(({box: targetUnit}) => {
                        const audioUnit = asInstanceOf(targetUnit, AudioUnitBox)
                        if (audioUnit.type.getValue() !== AudioUnitType.Output) {
                            feedsInto.add(audioUnit, unit)
                        }
                    })
                }
            })
        })

        // Roots are:
        // 1. Units with no output
        // 2. Units that connect directly to Output (become independent roots)
        // 3. The Output unit itself (as a standalone root)
        const roots = audioUnits.filter(unit => {
            if (unit.type.getValue() === AudioUnitType.Output) {return true}
            if (unit.output.targetVertex.isEmpty()) {return true}
            return unit.output.targetVertex
                .flatMap(({box}) => isInstanceOf(box, AudioBusBox) ? box.output.targetVertex : Option.None)
                .map(({box}) => asInstanceOf(box, AudioUnitBox).type.getValue() === AudioUnitType.Output)
                .unwrapOrElse(false)
        })

        const visited = new Set<AudioUnitBox>()
        return roots
            .map(root => buildTrackRecursive(root, feedsInto, visited))
            .filter(isDefined)
    }

    /**
     * Recursively assemble a track tree starting at the given audio unit.
     *
     * @param audioUnit - The root audio unit for this branch.
     * @param feedsInto - Mapping of downstream connections.
     * @param visited - Set used to break cycles.
     * @returns The assembled track node or `null` when a cycle is detected.
     */
    const buildTrackRecursive = (audioUnit: AudioUnitBox,
                                 feedsInto: ArrayMultimap<AudioUnitBox, AudioUnitBox>,
                                 visited: Set<AudioUnitBox>): Nullable<Track> => {
        if (visited.has(audioUnit)) {
            console.warn(`Cycle detected at AudioUnitBox`, audioUnit)
            return null
        }
        visited.add(audioUnit)
        const children = feedsInto.get(audioUnit)
            .map(childUnit => buildTrackRecursive(childUnit, feedsInto, visited))
            .filter(isDefined)
        return {audioUnit, children}
    }

    /**
     * Debug helper that logs the computed track hierarchy to the console.
     *
     * @param tracks - The track layout produced by {@link layout}.
     * @param indent - Current indentation level (used internally).
     */
    export const printTrackStructure = (tracks: ReadonlyArray<Track>, indent = 0): void => {
        const spaces = " ".repeat(indent)
        tracks.forEach(track => {
            const inputBox = track.audioUnit.input.pointerHub.incoming().at(0)?.box
            const label = DeviceBoxUtils.lookupLabelField(inputBox).getValue()
            console.debug(`${spaces}⌙ ${label} (${track.audioUnit.address.toString()})`)
            if (track.children.length > 0) {
                printTrackStructure(track.children, indent + 2)
            }
        })
    }
}
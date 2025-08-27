/**
 * Strategies describing how clips are visually modified during interactive
 * editing operations such as moving or mirroring.
 */
import {AnyClipBoxAdapter} from "@opendaw/studio-adapters"
import {int} from "@opendaw/lib-std"

/**
 * Bundles strategies to visualize and transform clips during editing.
 */
export interface ClipModifyStrategies {
    /** Whether the original clips should remain visible. */
    showOrigin(): boolean
    /** Strategy applied to selected clips. */
    selectedModifyStrategy(): ClipModifyStrategy
    /** Strategy applied to unselected clips. */
    unselectedModifyStrategy(): ClipModifyStrategy
}

export namespace ClipModifyStrategies {
    /** Identity strategy performing no modifications. */
    export const Identity: ClipModifyStrategies = Object.freeze({
        showOrigin: (): boolean => false,
        selectedModifyStrategy: (): ClipModifyStrategy => ClipModifyStrategy.Identity,
        unselectedModifyStrategy: (): ClipModifyStrategy => ClipModifyStrategy.Identity
    })
}


/**
 * Describes how a clip should be read or transformed for temporary preview.
 */
export interface ClipModifyStrategy {
    /** Returns the index where the clip should appear. */
    readClipIndex(clip: AnyClipBoxAdapter): int
    /** Whether the clip should be rendered mirrored. */
    readMirror(clip: AnyClipBoxAdapter): boolean
    /**
     * Translates the track index used to look up clips. It allows previews
     * to show clips on different tracks than the original ones.
     */
    translateTrackIndex(index: int): int
}

export namespace ClipModifyStrategy {
    /** Identity strategy leaving clips untouched. */
    export const Identity: ClipModifyStrategy = Object.freeze({
        readClipIndex: (clip: AnyClipBoxAdapter): number => clip.indexField.getValue(),
        readMirror: (clip: AnyClipBoxAdapter): boolean => clip.canMirror && clip.isMirrowed,
        translateTrackIndex: (index: number): number => index
    })
}
// noinspection PointlessArithmeticExpressionJS

/**
 * Utilities for building a tiny demo project that plays a simple arpeggio.
 *
 * The exported {@link createExampleProject} helper is consumed by the
 * headless {@code main.ts} entry point.
 */
import {PPQN} from "@opendaw/lib-dsp"
import {EffectFactories, InstrumentFactories, Project, ProjectEnv} from "@opendaw/studio-core"

const {Bar, Quarter} = PPQN

/**
 * Create a minimal project demonstrating instrument and effect creation.
 */
export const createExampleProject = (env: ProjectEnv): Project => {
    const project = Project.new(env)
    const {api, editing} = project
    // @ts-expect-error: demo code ignores return values from insertEffect
    const {boxA, boxB, boxC} = editing.modify(() => {
        const {to} = project.timelineBoxAdapter.box.loopArea
        to.setValue(Bar)
        const {trackBox, audioUnitBox} = api.createInstrument(InstrumentFactories.Vaporisateur)
        const noteRegionBox = api.createNoteRegion({
            trackBox: trackBox,
            position: 0,
            duration: Bar,
            loopDuration: Quarter
        })
        api.createNoteEvent({owner: noteRegionBox, position: 0, duration: Quarter, pitch: 60})
        api.createNoteEvent({owner: noteRegionBox, position: 0, duration: Quarter, pitch: 63})
        api.createNoteEvent({owner: noteRegionBox, position: 0, duration: Quarter, pitch: 67})
        api.createNoteEvent({owner: noteRegionBox, position: 0, duration: Quarter, pitch: 72})

        const boxA = api.insertEffect(audioUnitBox.midiEffects, EffectFactories.Arpeggio, 0)
        const boxB = api.insertEffect(audioUnitBox.midiEffects, EffectFactories.Pitch, 1)
        const boxC = api.insertEffect(audioUnitBox.midiEffects, EffectFactories.Zeitgeist, 2)
        return {boxA, boxB, boxC}
    }).unwrap()

    return project
}

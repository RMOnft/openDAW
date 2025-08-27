/**
 * Main entry point for the headless openDAW demo. This script boots the audio
 * engine and plays a small example project once the user interacts with the
 * page.
 *
 * Relies on {@link testFeatures} to ensure required browser APIs are present
 * and uses {@link SampleApi} to fetch audio data for
 * {@link createExampleProject}.
 *
 * Security note: The demo relies on cross-origin isolation and local worker
 * bundles. Serve this page over HTTPS and avoid loading untrusted scripts to
 * prevent privilege escalation.
 */
import "./style.css"
import {assert, Progress, UUID} from "@opendaw/lib-std"
import {PPQN} from "@opendaw/lib-dsp"
import {AnimationFrame, Browser} from "@opendaw/lib-dom"
import {Promises} from "@opendaw/lib-runtime"
import {AudioData, SampleMetaData} from "@opendaw/studio-adapters"
import {MainThreadSampleManager, Project, WorkerAgents, Worklets} from "@opendaw/studio-core"
import {testFeatures} from "./features"
import {SampleApi} from "./SampleApi"

import WorkersUrl from "@opendaw/studio-core/workers.js?worker&url"
import WorkletsUrl from "@opendaw/studio-core/processors.js?url"
import {createExampleProject} from "./ExampleProject"

(async () => {
    console.debug("openDAW -> headless")
    console.debug("Agent", Browser.userAgent)
    console.debug("isLocalHost", Browser.isLocalHost())
    assert(crossOriginIsolated, "window must be crossOriginIsolated")
    console.debug("booting...")
    document.body.textContent = "booting..."

    // Install worker scripts used by the core engine.
    WorkerAgents.install(WorkersUrl)

    // Abort early if required browser APIs are missing.
    {
        const {status, error} = await Promises.tryCatch(testFeatures())
        if (status === "rejected") {
            document.querySelector("#preloader")?.remove()
            alert(`Could not test features (${error})`)
            return
        }
    }

    // Prepare the audio context and install worklets.
    const context = new AudioContext({latencyHint: 0})
    console.debug(`AudioContext state: ${context.state}, sampleRate: ${context.sampleRate}`)
    {
        const {status, error} = await Promises.tryCatch(Worklets.install(context, WorkletsUrl))
        if (status === "rejected") {
            alert(`Could not install Worklets (${error})`)
            return
        }
    }

    // Create and play the example project when the user clicks.
    {
        const sampleManager = new MainThreadSampleManager({
            fetch: (uuid: UUID.Format, progress: Progress.Handler): Promise<[AudioData, SampleMetaData]> =>
                SampleApi.load(context, uuid, progress)
        }, context)

        const loadProject = false
        const env = {sampleManager, sampleRate: context.sampleRate}
        const project = loadProject
            ? Project.load(env, await fetch("subset.od").then(x => x.arrayBuffer()))
            : createExampleProject(env)
        const worklet = Worklets.get(context).createEngine(project)
        await worklet.isReady()
        // eslint-disable-next-line no-empty
        while (!await worklet.queryLoadingComplete()) {}
        worklet.connect(context.destination)
        window.addEventListener("click", () => {
            worklet.play()
            AnimationFrame.add(() => {
                const ppqn = worklet.position.getValue()
                const {bars, beats} = PPQN.toParts(ppqn)
                document.body.textContent = `${bars + 1}:${beats + 1}`
            })
        }, {once: true})
    }

    // Resume audio context on user gesture if the browser started it suspended.
    if (context.state === "suspended") {
        window.addEventListener("click",
            async () => await context.resume().then(() =>
                console.debug(`AudioContext resumed (${context.state})`)), {capture: true, once: true})
    }

    AnimationFrame.start()
    document.querySelector("#preloader")?.remove()
    document.body.textContent = "Ready."
})()

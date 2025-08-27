import {Observer, Subscription, Terminable, UUID} from "@opendaw/lib-std"
import {Processor, ProcessPhase} from "./processing"
import {LiveStreamBroadcaster} from "@opendaw/lib-fusion"
import {UpdateClock} from "./UpdateClock"
import {TimeInfo} from "./TimeInfo"
import {AudioUnit} from "./AudioUnit"
import {Mixer} from "./Mixer"
import {BoxAdaptersContext, EngineToClient} from "@opendaw/studio-adapters"

/**
 * Shared services and registries exposed to processors within the engine.
 */
export interface EngineContext extends BoxAdaptersContext, Terminable {
    /** Live broadcast channel for metering and analysis data. */
    get broadcaster(): LiveStreamBroadcaster
    /** Clock scheduling automation updates. */
    get updateClock(): UpdateClock
    /** Provides transport related timing information. */
    get timeInfo(): TimeInfo
    /** Global mixer instance. */
    get mixer(): Mixer
    /** IPC bridge used to forward engine events to the client. */
    get engineToClient(): EngineToClient

    /** Looks up an {@link AudioUnit} by UUID. */
    getAudioUnit(uuid: UUID.Format): AudioUnit
    /** Registers a processor with the engine graph. */
    registerProcessor(processor: Processor): Terminable
    /** Registers a connection between processors. */
    registerEdge(source: Processor, target: Processor): Terminable
    /** Subscribes to notifications for each processing phase. */
    subscribeProcessPhase(observer: Observer<ProcessPhase>): Subscription
}
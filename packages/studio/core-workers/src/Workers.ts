import {Messenger} from "@opendaw/lib-runtime"
import {OpfsWorker, SamplePeakWorker} from "@opendaw/lib-fusion"

/**
 * Bootstraps all studio worker services.
 *
 * This module runs inside a dedicated {@link Worker} and wires together
 * various worker utilities using a shared {@link Messenger} instance. The
 * worker is installed via {@link WorkerAgents.install} and exposes
 * functionality like OPFS access and peak analysis.
 */

/** Shared messenger for worker communication. */
const messenger: Messenger = Messenger.for(self)

/** Mounts the OPFS helper worker. */
OpfsWorker.init(messenger)

/** Installs the sample peak generation worker. */
SamplePeakWorker.install(messenger)

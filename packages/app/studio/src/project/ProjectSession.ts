import {ProjectMeta} from "./ProjectMeta"
import {Notifier, Observer, Option, Subscription, UUID} from "@opendaw/lib-std"
import {Projects} from "@/project/Projects"
import {showApproveDialog} from "@/ui/components/dialogs"
import {Promises} from "@opendaw/lib-runtime"
import {MidiDeviceAccess} from "@/midi/devices/MidiDeviceAccess"
import {StudioService} from "@/service/StudioService"
import {Project} from "@opendaw/studio-core"

/**
 * Wraps a loaded project together with its metadata and persistence helpers.
 *
 * @example
 * ```ts
 * const session = new ProjectSession(service, uuid, project, meta, Option.None, true)
 * await session.save()
 * ```
 */
export class ProjectSession {
    readonly #service: StudioService
    readonly #uuid: UUID.Format
    readonly #project: Project
    readonly #meta: ProjectMeta

    #cover: Option<ArrayBuffer>

    readonly #metaUpdated: Notifier<ProjectMeta>

    #saved: boolean
    #hasChanges: boolean = false

    constructor(service: StudioService,
                uuid: UUID.Format,
                project: Project,
                meta: ProjectMeta,
                cover: Option<ArrayBuffer>,
                hasBeenSaved: boolean = false) {
        this.#service = service
        this.#uuid = uuid
        this.#project = project
        this.#meta = meta
        this.#cover = cover

        this.#saved = hasBeenSaved
        this.#metaUpdated = new Notifier<ProjectMeta>()
    }

    get uuid(): UUID.Format {return this.#uuid}
    get project(): Project {return this.#project}
    get meta(): ProjectMeta {return this.#meta}
    get cover(): Option<ArrayBuffer> {return this.#cover}

    /**
     * Persist the current project state to storage.
     */
    async save(): Promise<void> {
        this.updateModifyDate()
        this.saveMidiConfiguration()
        return this.#saved
            ? Projects.saveProject(this).then(() => {this.#hasChanges = false})
            : Promise.reject("Project has not been saved")
    }

    /**
     * Save the project under a new name.
     *
     * @example
     * ```ts
     * await session.saveAs({name: "copy", description: "", tags: [], created: date, modified: date})
     * ```
     */
    async saveAs(meta: ProjectMeta): Promise<Option<ProjectSession>> {
        Object.assign(this.meta, meta)
        this.updateModifyDate()
        if (this.#saved) {
            // Copy project
            const uuid = UUID.generate()
            const midiConnections = this.#service.midiLearning.toJSON()
            const project = this.project.copy()
            const meta = ProjectMeta.copy(this.meta)
            const session = new ProjectSession(this.#service, uuid, project, meta, Option.None, true)
            this.#service.midiLearning.fromJSON(midiConnections)
            session.saveMidiConfiguration()
            await Projects.saveProject(session)
            return Option.wrap(session)
        } else {
            // Save project
            return Projects.saveProject(this).then(() => {
                this.#saved = true
                this.#hasChanges = false
                this.#metaUpdated.notify(this.meta)
                return Option.None
            })
        }
    }

    /** Whether the session has been written to persistent storage. */
    saved(): boolean {return this.#saved}
    /** Indicates if project or metadata changes are pending. */
    hasChanges(): boolean {return this.#hasChanges}

    /** Subscribe to metadata updates. */
    subscribeMetaData(observer: Observer<ProjectMeta>): Subscription {
        return this.#metaUpdated.subscribe(observer)
    }

    /** Subscribe to metadata updates and immediately receive the current value. */
    catchSubscribeMetaData(observer: Observer<ProjectMeta>): Subscription {
        observer(this.meta)
        return this.subscribeMetaData(observer)
    }

    /**
     * Update the session's cover image.
     */
    updateCover(cover: Option<ArrayBuffer>): void {
        this.#cover = cover
        this.#hasChanges = true
    }

    /**
     * Modify a metadata field and notify subscribers.
     */
    updateMetaData<KEY extends keyof ProjectMeta>(key: KEY, value: ProjectMeta[KEY]): void {
        if (this.meta[key] === value) {return}
        this.meta[key] = value
        this.#hasChanges = true
        this.#metaUpdated.notify(this.meta)
    }

    /** Update the modification timestamp. */
    updateModifyDate(): void {this.meta.modified = new Date().toISOString()}

    /** Persist the current MIDI learn configuration to local storage. */
    saveMidiConfiguration(): void {
        const key = UUID.toString(this.#uuid)
        console.debug(`saveMidiConfiguration(${key})`)
        this.#service.midiLearning.saveToLocalStorage(key)
    }

    /**
     * Load the MIDI learn configuration and optionally prompt to connect
     * a device if mappings are present.
     */
    async loadMidiConfiguration(): Promise<void> {
        const key = UUID.toString(this.#uuid)
        const hasMidi = this.#service.midiLearning.loadFromLocalStorage(key)
        console.debug(`loadMidiConfiguration(${key}) - hasMidi: ${hasMidi}`)
        if (!MidiDeviceAccess.available().getValue() && hasMidi) {
            const {status} = await Promises.tryCatch(showApproveDialog({
                headline: "Midi Configuration Found",
                approveText: "Connect",
                message: "Connect your midi-device and click 'connect'.",
                reverse: true
            }))
            if (status === "resolved") {
                MidiDeviceAccess.available().setValue(true)
            }
        }
    }

    /** String representation for debugging. */
    toString(): string {
        return `{uuid: ${UUID.toString(this.uuid)}, meta: ${JSON.stringify(this.meta)}}`
    }
}

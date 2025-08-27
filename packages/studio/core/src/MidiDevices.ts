import {
    Lazy,
    MutableObservableOption,
    MutableObservableValue,
    Notifier,
    ObservableOption,
    ObservableValue,
    Observer,
    Option,
    Subscription,
    warn
} from "@opendaw/lib-std"
import {MidiData} from "@opendaw/lib-midi"
import {Promises} from "@opendaw/lib-runtime"

/**
 * Utility for requesting and interacting with Web MIDI devices.
 *
 * @public
 */
export class MidiDevices {
    /** Returns `true` if the current environment supports the Web MIDI API. */
    static canRequestMidiAccess(): boolean {return "requestMIDIAccess" in navigator}

    /** Requests permission to access MIDI devices from the browser. */
    static async requestPermission() {
        if (this.canRequestMidiAccess()) {
            const {status, value: midiAccess, error} =
                await Promises.tryCatch(navigator.requestMIDIAccess({sysex: false}))
            if (status === "rejected") {
                console.warn(error)
                return warn("Could not request MIDI")
            }
            const numberOfInputs = midiAccess.inputs.size
            const numberOfOutputs = midiAccess.outputs.size
            console.debug(`MIDI access granted: ${numberOfInputs} inputs, ${numberOfOutputs} outputs`)
            this.#midiAccess.wrap(midiAccess)
        } else {
            return warn("This browser does not support MIDI")
        }
    }

    /** Observable access to the current {@link MIDIAccess} instance. */
    static get(): ObservableOption<MIDIAccess> {return this.#midiAccess}

    /** Returns the list of available MIDI inputs, if any. */
    static inputs(): Option<ReadonlyArray<MIDIInput>> {
        return this.get().map(({inputs}) => Array.from(inputs.values()))
    }

    /** Returns the list of available MIDI outputs, if any. */
    static outputs(): Option<ReadonlyArray<MIDIOutput>> {
        return this.get().map(({outputs}) => Array.from(outputs.values()))
    }

    /** Sends note-off messages to all channels and notes. */
    static panic(): void {
        this.get().ifSome((midiAccess: MIDIAccess) => {
            for (let note = 0; note < 128; note++) {
                for (let channel = 0; channel < 16; channel++) {
                    const data = MidiData.noteOff(channel, note)
                    const event = new MessageEvent("midimessage", {data})
            for (const input of midiAccess.inputs.values()) {
                        input.dispatchEvent(event)
                    }
            for (const output of midiAccess.outputs.values()) {
                        output.send(data)
                    }
                }
            }
        })
    }

    @Lazy
    /** Observable indicating whether MIDI access has been granted. */
    static available(): MutableObservableValue<boolean> {
        return new class implements MutableObservableValue<boolean> {
            readonly #notifier: Notifier<ObservableValue<boolean>> = new Notifier<ObservableValue<boolean>>()

            constructor() {
                const subscription = MidiDevices.get().subscribe(option => {
                    if (option.nonEmpty()) {
                        subscription.terminate()
                        this.#notifier.notify(this)
                    } // MIDIAccess cannot be turned off
                })
            }

            setValue(value: boolean): void {
                  if (!value || MidiDevices.#midiAccess.nonEmpty() || MidiDevices.#isRequesting) {return}
                  console.debug("Request MIDI access")
                  MidiDevices.#isRequesting = true
                  MidiDevices.requestPermission().finally(() => MidiDevices.#isRequesting = false)
            }

              getValue(): boolean {return MidiDevices.#midiAccess.nonEmpty()}
          
            catchupAndSubscribe(observer: Observer<ObservableValue<boolean>>): Subscription {
                observer(this)
                return this.#notifier.subscribe(observer)
            }

            subscribe(observer: Observer<ObservableValue<boolean>>): Subscription {
                return this.#notifier.subscribe(observer)
            }
        }
    }

    static #isRequesting: boolean = false

    static #midiAccess: MutableObservableOption<MIDIAccess> = new MutableObservableOption<MIDIAccess>()
}
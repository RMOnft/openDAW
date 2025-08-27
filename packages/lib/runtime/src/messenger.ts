import { isDefined, Notifier, Nullable, Observable, Observer, Procedure, Subscription, Terminable } from "@opendaw/lib-std"

/**
 * Minimal subset of the {@link MessagePort} interface required by {@link Messenger}.
 *
 * @remarks
 * The port may be a {@link Worker}, {@link MessagePort}, {@link BroadcastChannel},
 * or any compatible object exposing `postMessage` and the event callbacks.
 */
export type Port = {
    /** Sends a message through the underlying channel. */
    postMessage(message: any): void
    /** Callback invoked when a message is received. */
    onmessage: Nullable<Procedure<MessageEvent>>
    /** Callback invoked when an error occurs while sending a message. */
    onmessageerror: Nullable<Procedure<MessageEvent>>
}

/**
 * Factory for creating {@link Messenger} instances.
 *
 * @example
 * ```ts
 * const { port1 } = new MessageChannel()
 * const messenger = Messenger.for(port1)
 * messenger.send("ping")
 * ```
 *
 * @param port - Communication endpoint used to exchange messages.
 * @returns A messenger bound to the given port.
 */
export const Messenger = { for: (port: Port): Messenger => new NativeMessenger(port) }

/**
 * Observable wrapper around a {@link Port}.
 *
 * @remarks
 * `Messenger` instances can create named sub channels using {@link Messenger.channel}
 * to multiplex communication over the same port.
 */
export type Messenger = Observable<any> & Terminable & {
    /**
     * Sends a message through the underlying port.
     *
     * @param message - Arbitrary data to send.
     */
    send(message: any): void
    /**
     * Creates a messenger that filters messages by channel name.
     *
     * @param name - Name of the sub channel.
     * @returns New messenger bound to the given channel.
     */
    channel(name: string): Messenger
}

class NativeMessenger implements Messenger {
    readonly #port: Port
    readonly #notifier = new Notifier<any>()

    /**
     * Creates a new messenger around the provided {@link Port}.
     * The constructor asserts that the port is not already in use.
     *
     * @param port - Port to wrap.
     */
    constructor(port: Port) {
        this.#port = port

        if (isDefined(port.onmessage) || isDefined(port.onmessageerror)) {
            console.error(port)
            throw new Error(`${port} is already wrapped.`)
        }
        port.onmessage = (event: MessageEvent) => this.#notifier.notify(event.data)
        port.onmessageerror = (event: MessageEvent) => {
            throw new Error(event.type)
        }
    }

    /** @inheritdoc */
    send(message: any): void {
        this.#port.postMessage(message)
    }
    /** @inheritdoc */
    channel(name: string): Messenger {
        return new Channel(this, name)
    }
    /** @inheritdoc */
    subscribe(observer: Observer<MessageEvent>): Subscription {
        return this.#notifier.subscribe(observer)
    }
    /** @inheritdoc */
    terminate(): void {
        this.#notifier.terminate()
        this.#port.onmessage = null
        this.#port.onmessageerror = null
    }
}

class Channel implements Messenger {
    readonly #messages: Messenger
    readonly #name: string
    readonly #notifier = new Notifier<any>()
    readonly #subscription: Subscription

    /**
     * @param messages - Parent messenger to forward messages through.
     * @param name - Name of the logical sub channel.
     */
    constructor(messages: Messenger, name: string) {
        this.#messages = messages
        this.#name = name
        this.#subscription = messages.subscribe(data => {
            if ("message" in data && "channel" in data && data.channel === name) {
                this.#notifier.notify(data.message)
            }
        })
    }

    /** @inheritdoc */
    send(message: any): void {
        this.#messages.send({ channel: this.#name, message })
    }
    /** @inheritdoc */
    channel(name: string): Messenger {
        return new Channel(this, name)
    }
    /** @inheritdoc */
    subscribe(observer: Observer<MessageEvent>): Subscription {
        return this.#notifier.subscribe(observer)
    }
    /** @inheritdoc */
    terminate(): void {
        this.#subscription.terminate()
        this.#notifier.terminate()
    }
}


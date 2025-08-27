import {isDefined, Option, Stringifiable, Terminable} from "@opendaw/lib-std"
import {WeakRefSet} from "./weak"

/**
 * Lightweight dependency injection helpers that bind reactive values to DOM
 * elements. Instances created here keep only weak references to their
 * targets so they can be garbage collected when removed from the DOM.
 */
export namespace Inject {
    /**
     * Creates a new {@link Ref} instance that can later expose a DOM element
     * to other parts of the application.
     */
    export const ref = <T>() => new Ref<T>()

    /**
     * Creates a reactive text node value. Updating the returned {@link Value}
     * propagates the change to all bound text nodes.
     */
    export const value = <T extends Stringifiable>(initialValue: T) => new Value<T>(initialValue)

    /**
     * Creates a class list manager which keeps class names in sync across
     * multiple elements.
     */
    export const classList = (...initialClassNames: Array<string>) => new ClassList(initialClassNames)

    /**
     * Creates a reactive attribute value. All bound elements will receive the
     * attribute whenever the value changes.
     */
    export const attribute = (initialAttributeValue: string) => new Attribute(initialAttributeValue)

    /** Internal interface used by the injection helpers. */
    interface Injector<T> extends Terminable {addTarget(target: T, ...args: Array<unknown>): void}

    /**
     * Holds a reference to a single DOM element. Calling {@link Ref.get}
     * returns the element, throwing if no element was bound.
     */
    export class Ref<T> implements Injector<T> {
        #target: Option<T> = Option.None

        /** Returns the bound target or throws when none is present. */
        get(): T {return this.#target.unwrap("No target provided")}

        /** Binds the target element. */
        addTarget(target: T): void {this.#target = Option.wrap(target)}

        /** Indicates whether a target has been bound. */
        hasTarget(): boolean {return this.#target.nonEmpty()}

        /** Clears the bound target. */
        terminate(): void {this.#target = Option.None}
    }

    /**
     * Reactive text value that updates all registered text nodes whenever the
     * underlying value changes.
     */
    export class Value<T extends Stringifiable = Stringifiable> implements Injector<Text> {
        readonly #targets = new WeakRefSet<Text>()

        #value: T

        constructor(value: T) {this.#value = value}

        /** Current value of the text. */
        get value(): T {return this.#value}

        /** Updates the value and synchronizes all bound text nodes. */
        set value(value: T) {
            if (this.#value === value) {return}
            this.#value = value
            this.#targets.forEach(text => {text.nodeValue = String(value)})
        }

        /** Registers a text node to be updated. */
        addTarget(text: Text): void {this.#targets.add(text)}

        /** Releases all registered text nodes. */
        terminate(): void {this.#targets.clear()}
    }

    /**
     * Manages a synchronized set of CSS class names across multiple elements.
     */
    export class ClassList implements Injector<Element> {
        readonly #targets: WeakRefSet<Element>
        readonly #classes: Set<string>

        constructor(classes: Array<string>) {
            this.#targets = new WeakRefSet<Element>()
            this.#classes = new Set<string>(classes)
        }

        /** Adds a class name to the set and updates all targets. */
        add(className: string): void {
            this.#classes.add(className)
            this.#updateElements()
        }

        /** Removes a class name from the set and updates all targets. */
        remove(className: string): void {
            this.#classes.delete(className)
            this.#updateElements()
        }

        /**
         * Toggles a class name, optionally forcing the resulting state.
         * When `force` is omitted the class is simply toggled.
         */
        toggle(className: string, force?: boolean): void {
            if (isDefined(force)) {
                if (force) {
                    this.#classes.add(className)
                } else {
                    this.#classes.delete(className)
                }
            } else {
                if (this.#classes.has(className)) {
                    this.#classes.delete(className)
                } else {
                    this.#classes.add(className)
                }
            }
            this.#updateElements()
        }

        /** Registers a new element to receive class updates. */
        addTarget(target: Element): void {
            this.#targets.add(target)
            this.#updateElement(target)
        }

        /** Clears all tracked elements. */
        terminate(): void {this.#targets.clear()}

        #updateElements(): void {this.#targets.forEach(this.#updateElement)}

        readonly #updateElement: (element: Element) => void =
            (element: Element) => {element.className = Array.from(this.#classes).join(" ")}
    }

    /**
     * Represents a mutable attribute value that can be shared across multiple
     * elements.
     */
    export class Attribute implements Injector<Element> {
        readonly #targets: WeakRefSet<Element>
        readonly #keys: WeakMap<Element, string>

        #value: string

        constructor(value: string) {
            this.#targets = new WeakRefSet<Element>()
            this.#keys = new WeakMap<Element, string>()
            this.#value = value
        }

        /** Current attribute value. */
        get value(): string {return this.#value}

        /** Updates the attribute value on all registered elements. */
        set value(value: string) {
            if (this.#value === value) {return}
            this.#value = value
            this.#updateElements()
        }

        /** Toggles the attribute between two values. */
        toggle(expected: string, alternative: string): void {
            this.value = this.value === expected ? alternative : expected
        }

        /** Registers an element and the attribute key it should receive. */
        addTarget(target: Element, key: string): void {
            this.#targets.add(target)
            this.#keys.set(target, key)
            this.#updateElement(target)
        }

        /** Releases all tracked elements. */
        terminate(): void {this.#targets.clear()}

        #updateElements(): void {this.#targets.forEach(this.#updateElement)}

        readonly #updateElement: (element: Element) => void = (element: Element) => {
            const key = this.#keys.get(element)
            if (key !== undefined) {
                element.setAttribute(key, this.#value)
            }
        }
    }
}
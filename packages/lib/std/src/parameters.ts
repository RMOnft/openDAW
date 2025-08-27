import {Observer} from "./observers"
import {Subscription, Terminable} from "./terminable"
import {Primitive, unitValue} from "./lang"
import {ValueMapping} from "./value-mapping"
import {StringMapping, StringResult} from "./string-mapping"
import {clamp} from "./math"
import {Notifier} from "./notifier"
import {Observable, ObservableValue} from "./observables"

/** Observable value that can also be represented in normalized [0,1] form. */
export interface ObservableUnitValue extends Observable<ObservableUnitValue> {
    setUnitValue: (value: unitValue) => void
    getUnitValue: () => unitValue
}

export type PrintValue = StringResult

/** Observable value with a string representation. */
export interface ObservablePrintValue extends Observable<ObservablePrintValue> {
    setPrintValue(text: string): void
    getPrintValue(): PrintValue
}

/** Sources that can influence a {@link Parameter}. */
export type ControlSource = "automated" | "modulated" | "midi" | "external"

/** Listener notified when control sources change. */
export interface ControlSourceListener {
    onControlSourceAdd(source: ControlSource): void
    onControlSourceRemove(source: ControlSource): void
}

/** Interface describing a controllable parameter. */
export interface Parameter<T extends Primitive = Primitive> extends ObservableValue<T>, ObservableUnitValue, ObservablePrintValue, Terminable {
    subscribe(observer: Observer<Parameter<T>>): Subscription
    catchupAndSubscribeControlSources(observer: ControlSourceListener): Subscription

    /** Current value as set by control sources. */
    getControlledValue(): T
    /** Controlled value in normalized form. */
    getControlledUnitValue(): unitValue
    /** Controlled value as printable string. */
    getControlledPrintValue(): Readonly<StringResult>

    get valueMapping(): ValueMapping<T>
    get stringMapping(): StringMapping<T>
    get name(): string
}

/** Default {@link Parameter} implementation storing its value in memory. */
export class DefaultParameter<T extends Primitive = Primitive> implements Parameter<T> {
    static percent(name: string, value: unitValue): Parameter<unitValue> {
        return new DefaultParameter<unitValue>(ValueMapping.unipolar(), StringMapping.percent(), name, value)
    }

    readonly #notifier: Notifier<Parameter<T>> = new Notifier<Parameter<T>>()
    readonly #valueMapping: ValueMapping<T>
    readonly #stringMapping: StringMapping<T>
    readonly #name: string
    readonly #resetValue: T

    #value: T

    constructor(valueMapping: ValueMapping<T>, stringMapping: StringMapping<T>, name: string, value: T) {
        this.#valueMapping = valueMapping
        this.#stringMapping = stringMapping
        this.#name = name
        this.#resetValue = value
        this.#value = value
    }

    catchupAndSubscribeControlSources(_observer: ControlSourceListener): Subscription {return Terminable.Empty}

    getControlledValue(): T {return this.getValue()}
    getControlledUnitValue(): unitValue {return this.getUnitValue()}
    getControlledPrintValue(): Readonly<StringResult> {return this.getPrintValue()}

    get valueMapping(): ValueMapping<T> {return this.#valueMapping}
    get stringMapping(): StringMapping<T> {return this.#stringMapping}
    get name(): string {return this.#name}
    get resetValue(): T {return this.#resetValue}

    /** Resets the parameter to its initial value. */
    reset(): void {this.setValue(this.#resetValue)}

    subscribe(observer: Observer<Parameter<T>>): Subscription {return this.#notifier.subscribe(observer)}
    catchupAndSubscribe(observer: Observer<Parameter<T>>): Subscription {
        observer(this)
        return this.subscribe(observer)
    }

    /** Returns the raw value. */
    getValue(): T {return this.#value}
    /** Sets the raw value, clamping via {@link valueMapping}. */
    setValue(value: T): void {
        value = this.#valueMapping.clamp(value)
        if (this.#value === value) {return}
        this.#value = value
        this.#notifier.notify(this)
    }

    /** Sets the value via normalized representation. */
    setUnitValue(value: unitValue): void {this.setValue(this.#valueMapping.y(clamp(value, 0.0, 1.0)))}
    /** Returns the normalized value. */
    getUnitValue(): unitValue {return this.#valueMapping.x(this.#value)}

    /** Printable representation of the current value. */
    getPrintValue(): Readonly<StringResult> {return this.#stringMapping.x(this.#value)}
    /** Updates value from a string, if possible. */
    setPrintValue(text: string): void {
        const result = this.#stringMapping.y(text)
        if (result.type === "unitValue") {
            this.setUnitValue(result.value)
        } else if (result.type === "explicit") {
            this.setValue(result.value)
        }
    }

    terminate(): void {this.#notifier.terminate()}
}
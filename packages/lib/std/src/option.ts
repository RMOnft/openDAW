import {
    AnyFunc,
    asDefined,
    Func,
    getOrProvide,
    isDefined,
    Nullable,
    Nullish,
    panic,
    Procedure,
    Provider,
    ValueOrProvider
} from "./lang"

/**
 * Lightweight `Option` type inspired by Rust.
 * Represents either `Some<T>` or `None` and provides combinators for
 * working with potentially missing values without `null` checks.
 */
export interface Option<T> {
    /** Returns the contained value or throws. */
    unwrap(fail?: ValueOrProvider<string>): T
    /** Returns the contained value or a fallback. */
    unwrapOrElse(or: ValueOrProvider<T>): T
    /** Returns the value or `null`. */
    unwrapOrNull(): Nullable<T>
    /** Returns the value or `undefined`. */
    unwrapOrUndefined(): T | undefined
    /** Pattern matches on the option. */
    match<R>(matchable: Option.Matchable<T, R>): R
    /** Executes the procedure if the option is `Some`. */
    ifSome<R>(procedure: Procedure<T>): R | undefined
    /** Checks whether the option contains the given value. */
    contains(value: T): boolean
    /** True if the option is `None`. */
    isEmpty(): boolean
    /** True if the option is `Some`. */
    nonEmpty(): boolean
    /** Maps the wrapped value through a function. */
    map<U>(func: Func<T, U>): Option<U>
    /** Maps the value or returns a fallback. */
    mapOr<U>(func: Func<T, U>, or: ValueOrProvider<U>): U
    /** Flat maps to another option. */
    flatMap<U>(func: Func<T, Option<U>>): Option<U>
    /** Compares for structural equality. */
    equals(other: Option<T>): boolean
    /** Asserts the option is not `None`. */
    assert(fail?: ValueOrProvider<string>): this
}

export namespace Option {
    /** Function pair used by {@link Option.match}. */
    export interface Matchable<T, RETURN> {
        some: Func<T, RETURN>
        none: Provider<RETURN>
    }

    /** Wraps a possibly nullish value into an {@link Option}. */
    export const wrap = <T>(value: Nullish<T>): Option<T | never> => isDefined(value) ? new Some(value) : None
    /** Lazily evaluates a provider and wraps the result. */
    export const from = <T>(provider: Provider<Nullish<T>>): Option<T> => wrap(provider())
    /** Executes a provider and catches thrown errors, returning `None` on failure. */
    export const tryFrom = <T>(provider: Provider<T>): Option<T> => {
        try {return Option.wrap(provider())} catch (_error) {return Option.None}
    }
    /** Executes the function if present and wraps the result. */
    export const execute = <F extends AnyFunc>(func: Nullish<F>, ...args: Parameters<F>)
        : Option<ReturnType<F>> => Option.wrap(func?.apply(null, args))
    /** Wraps the resolved value of a promise or `None` on rejection. */
    export const async = <RESULT>(promise: Promise<RESULT>): Promise<Option<RESULT>> =>
        promise.then(value => wrap(value), () => None)

    /** Concrete `Some` implementation holding a value. */
    export class Some<T> implements Option<T> {
        readonly #value: T
        constructor(value: T) {this.#value = asDefined(value)}
        unwrap(): T { return this.#value }
        unwrapOrElse(_: ValueOrProvider<T>): T { return this.#value }
        unwrapOrNull(): Nullable<T> { return this.#value }
        unwrapOrUndefined(): T | undefined {return this.#value }
        contains(value: T): boolean { return value === this.#value }
        match<R>(matchable: Matchable<T, R>): R {return matchable.some(this.#value)}
        ifSome<R extends undefined>(run: Func<T, R>): R {return run(this.#value)}
        isEmpty(): boolean { return false }
        nonEmpty(): boolean { return true }
        map<U>(callback: (value: T) => Nullable<U>): Option<U> {return Option.wrap(callback(this.#value))}
        mapOr<U>(func: Func<T, U>, _or: U | Provider<U>): U {return func(this.#value)}
        flatMap<U>(callback: (value: T) => Option<U>): Option<U> {return callback(this.#value)}
        equals(other: Option<T>): boolean {return this.unwrapOrNull() === other.unwrapOrNull()}
        assert(_fail?: ValueOrProvider<string>): this {return this}
        toString(): string {return `{Option.Some(${this.#value})}`}
        get [Symbol.toStringTag]() {return this.toString()}
    }

    /** Constant representing the absence of a value. */
    export const None: Option<never> = new class implements Option<never> {
        readonly unwrap = (fail?: ValueOrProvider<string>): never => panic(isDefined(fail) ? getOrProvide(fail) : "unwrap failed")
        readonly unwrapOrElse = <T>(value: ValueOrProvider<T>): T => getOrProvide(value)
        readonly unwrapOrNull = (): Nullable<never> => null
        readonly unwrapOrUndefined = <T>(): T | undefined => undefined
        readonly contains = (_: unknown): boolean => false
        readonly match = <R>(matchable: Matchable<never, R>): R => matchable.none()
        readonly ifSome = (_: Procedure<never>): undefined => {}
        readonly isEmpty = (): boolean => true
        readonly nonEmpty = (): boolean => false
        readonly map = <U>(_: (_: never) => U): Option<U> => None
        readonly mapOr = <U>(_: Func<never, U>, or: ValueOrProvider<U>): U => getOrProvide(or)
        readonly flatMap = (_: (_: never) => Option<never>): Option<never> => None
        readonly equals = (other: Option<any>): boolean => other.isEmpty()
        readonly assert = (fail?: ValueOrProvider<string>): this => panic(getOrProvide(fail) ?? "assert failed")
        readonly toString = (): string => "{Option.None}"
        get [Symbol.toStringTag]() {return this.toString()}
    }
}
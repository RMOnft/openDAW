/**
 * Time span calculation utilities.
 *
 * @public
 */
import { int, Unhandled } from "./lang";

/**
 * Represents a span of time with millisecond precision and provides
 * convenient factory methods and conversions.
 *
 * @public
 */
export class TimeSpan {
  /** Time span representing positive infinity. */
  static readonly POSITIVE_INFINITY = new TimeSpan(Number.POSITIVE_INFINITY);
  /** Creates a span from milliseconds. */
  static readonly millis = (value: number) => new TimeSpan(value);
  /** Creates a span from seconds. */
  static readonly seconds = (value: number) =>
    new TimeSpan(value * TimeSpan.#MILLI_SECONDS_PER_SECOND);
  /** Creates a span from minutes. */
  static readonly minutes = (value: number) =>
    new TimeSpan(value * TimeSpan.#MILLI_SECONDS_PER_MINUTE);
  /** Creates a span from hours. */
  static readonly hours = (value: number) =>
    new TimeSpan(value * TimeSpan.#MILLI_SECONDS_PER_HOUR);
  /** Creates a span from days. */
  static readonly days = (value: number) =>
    new TimeSpan(value * TimeSpan.#MILLI_SECONDS_PER_DAY);

  static readonly #MILLI_SECONDS_PER_SECOND = 1_000;
  static readonly #MILLI_SECONDS_PER_MINUTE = 60_000;
  static readonly #MILLI_SECONDS_PER_HOUR = 3_600_000;
  static readonly #MILLI_SECONDS_PER_DAY = 86_400_000;

  readonly #ms: number;

  private constructor(ms: number) {
    this.#ms = ms;
  }

  /** Returns the span in milliseconds. */
  millis(): number {
    return this.#ms;
  }
  /** Absolute value in seconds. */
  absSeconds(): number {
    return Math.abs(this.#ms) / TimeSpan.#MILLI_SECONDS_PER_SECOND;
  }
  /** Absolute value in minutes. */
  absMinutes(): number {
    return Math.abs(this.#ms) / TimeSpan.#MILLI_SECONDS_PER_MINUTE;
  }
  /** Absolute value in hours. */
  absHours(): number {
    return Math.abs(this.#ms) / TimeSpan.#MILLI_SECONDS_PER_HOUR;
  }
  /** Absolute value in days. */
  absDays(): number {
    return Math.abs(this.#ms) / TimeSpan.#MILLI_SECONDS_PER_DAY;
  }
  /** Splits the span into days, hours, minutes and seconds. */
  split(): { d: int; h: int; m: int; s: int } {
    return {
      d: Math.floor(this.absDays()),
      h: Math.floor(this.absHours()) % 24,
      m: Math.floor(this.absMinutes()) % 60,
      s: Math.floor(this.absSeconds()) % 60,
    };
  }
  /** Checks whether the span equals zero. */
  isNow(): boolean {
    return this.#ms === 0.0;
  }
  /** Checks whether the span is negative. */
  isPast(): boolean {
    return this.#ms < 0.0;
  }
  /** Checks whether the span is positive. */
  isFuture(): boolean {
    return this.#ms > 0.0;
  }
  /** Formats the span as a relative unit string such as `2 minutes`. */
  toUnitString(): string {
    let value: number, unit: Intl.RelativeTimeFormatUnit;
    const seconds = Math.floor(Math.abs(this.#ms) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (seconds < 60) {
      value = seconds;
      unit = "second";
    } else if (minutes < 60) {
      value = minutes;
      unit = "minute";
    } else if (hours < 24) {
      value = hours;
      unit = "hour";
    } else {
      value = days;
      unit = "day";
    }
    return new Intl.RelativeTimeFormat("en", {
      numeric: "auto",
      style: "long",
    }).format(value * Math.sign(this.#ms), unit);
  }
  /** Human readable representation such as `1 h, 2 m`. */
  toString(): string {
    if (isNaN(this.#ms)) {
      return "NaN";
    }
    if (!isFinite(this.#ms)) {
      return "∞";
    }
    const { d, h, m, s } = this.split();
    if (d > 0) {
      return [
        TimeSpan.#quantity("d", d),
        TimeSpan.#quantity("h", h),
        TimeSpan.#quantity("m", m),
        TimeSpan.#quantity("s", s),
      ].join(", ");
    } else if (h > 0) {
      return [
        TimeSpan.#quantity("h", h),
        TimeSpan.#quantity("m", m),
        TimeSpan.#quantity("s", s),
      ].join(", ");
    } else if (m > 0) {
      return [TimeSpan.#quantity("m", m), TimeSpan.#quantity("s", s)].join(
        ", ",
      );
    } else if (s > 0) {
      return TimeSpan.#quantity("s", s);
    } else {
      return "now";
    }
  }

  static readonly #quantity = (
    name: "d" | "h" | "m" | "s",
    count: int,
  ): string => {
    switch (name) {
      case "d":
        return `${count} ${count < 2 ? "day" : "days"}`;
      case "h":
        return `${count} ${count < 2 ? "hour" : "hours"}`;
      case "m":
        return `${count} ${count < 2 ? "minute" : "minutes"}`;
      case "s":
        return `${count} ${count < 2 ? "second" : "seconds"}`;
      default:
        return Unhandled(name);
    }
  };
}


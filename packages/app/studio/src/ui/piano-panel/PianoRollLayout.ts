import { MidiKeys } from "@opendaw/lib-dsp";
import { Arrays, asDefined, int, Lazy, Size } from "@opendaw/lib-std";

/** Horizontal position of a MIDI key within the piano roll. */
export type KeyProperties = { key: int; x: number };

/**
 * Computes positions and styling helpers for rendering a keyboard within the
 * piano roll. Layouts can be created for different key ranges such as 88 or 61
 * key keyboards.
 */
export class PianoRollLayout {
  /**
   * Pre-built layouts for common keyboard sizes. Index `0` corresponds to the
   * full 88 key layout.
   */
  @Lazy
  static Defaults() {
    return [
      new PianoRollLayout(21, 108), // 88
      new PianoRollLayout(28, 103), // 76
      new PianoRollLayout(36, 96), // 61
      new PianoRollLayout(36, 84), // 49
    ];
  }

  /** Returns a layout by index or the default 88 key layout if not found. */
  static getByIndex(index: int): PianoRollLayout {
    const layouts = this.Defaults();
    return layouts[index] ?? layouts[0];
  }

  static readonly WhiteKey: Size = { width: 20, height: 100 };
  static readonly BlackKey: Size = { width: 12, height: 60 };
  static readonly BlackKeyOffsets: Record<int, number> = {
    1: 0.55,
    3: 0.45,
    6: 0.55,
    8: 0.5,
    10: 0.45,
  } as const;

  static #moveToNextWhiteKey(key: int, direction: -1 | 1): int {
    while (MidiKeys.isBlackKey(key)) key += direction;
    return key;
  }

  readonly #min: int;
  readonly #max: int;

  readonly #whiteKeysX: Array<KeyProperties>;
  readonly #blackKeysX: Array<KeyProperties>;
  readonly #octaveSplits: Array<number>;
  readonly #centered: Array<number>;

  constructor(min: int, max: int) {
    this.#min = PianoRollLayout.#moveToNextWhiteKey(min, -1);
    this.#max = PianoRollLayout.#moveToNextWhiteKey(max, 1);
    this.#whiteKeysX = [];
    this.#blackKeysX = [];
    this.#octaveSplits = [];
    this.#centered = Arrays.create(() => 0, 128);
    this.#initialize();
  }

  /** Lowest MIDI key represented by the layout. */
  get min(): int {
    return this.#min;
  }
  /** Highest MIDI key represented by the layout. */
  get max(): int {
    return this.#max;
  }
  /** Number of keys in the layout. */
  get count(): int {
    return this.#max - this.#min + 1;
  }
  /** White key positions. */
  get whiteKeys(): ReadonlyArray<KeyProperties> {
    return this.#whiteKeysX;
  }
  /** Black key positions. */
  get blackKeys(): ReadonlyArray<KeyProperties> {
    return this.#blackKeysX;
  }
  /** Relative X positions marking octave boundaries. */
  get octaveSplits(): ReadonlyArray<number> {
    return this.#octaveSplits;
  }

  /**
   * Returns the normalized horizontal center for the given MIDI note index.
   */
  getCenteredX(index: int): number {
    return this.#centered[index];
  }

  /** Generates an HSL color for a note using its region hue and state. */
  getFillStyle(hue: number, isPlaying: boolean): string {
    const saturation = isPlaying ? 100 : 45;
    const lightness = isPlaying ? 80 : 60;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  #initialize(): void {
    const { WhiteKey, BlackKey, BlackKeyOffsets } = PianoRollLayout;
    let whiteIndex = 0;
    for (let key = this.#min | 0; key <= this.#max; key++) {
      const localNote = key % 12;
      if (MidiKeys.isBlackKey(key)) {
        const offset = asDefined(
          BlackKeyOffsets[localNote],
          "black index not found",
        );
        const x =
          (whiteIndex - offset) * WhiteKey.width +
          (WhiteKey.width - BlackKey.width) / 2.0;
        this.#blackKeysX.push({ key, x });
        this.#centered[key] = whiteIndex - offset + 0.5;
      } else {
        const x = whiteIndex * WhiteKey.width;
        this.#whiteKeysX.push({ key, x });
        this.#centered[key] = whiteIndex + 0.5;
        if (localNote === 0 || localNote === 5) {
          this.#octaveSplits.push(whiteIndex);
        }
        whiteIndex++;
      }
    }
    this.#octaveSplits.forEach(
      (x, index, array) => (array[index] = x / whiteIndex),
    );
    this.#centered.forEach(
      (x, index, array) => (array[index] = x / whiteIndex),
    );
  }
}

/**
 * Smoke tests for the MIDI entry module, ensuring exports and global registration.
 */
import { describe, expect, it } from "vitest";
import * as Midi from "./index";

describe("lib-midi index", () => {
  it("registers a global symbol", () => {
    const key = Symbol.for("@openDAW/lib-midi");
    expect((globalThis as any)[key]).toBe(true);
  });

  it("exposes MidiFileDecoder", () => {
    expect(Midi.MidiFileDecoder).toBeTypeOf("function");
  });
});

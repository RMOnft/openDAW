import { byte, ByteArrayInput, ByteArrayOutput } from "@opendaw/lib-std";
import { MidiTrack } from "./MidiTrack";
import { Chunk } from "./Chunk";
import { MidiFileDecoder } from "./MidiFileDecoder";

/**
 * Utilities for decoding and encoding Standard MIDI Files.
 */
export namespace MidiFile {
  /**
   * Create a decoder for the provided MIDI file buffer.
   */
  export const decoder = (buffer: ArrayBuffer): MidiFileDecoder =>
    new MidiFileDecoder(new ByteArrayInput(buffer));

  /**
   * Create a new encoder for generating MIDI files.
   */
  export const encoder = (): MidiFileEncoder => new MidiFileEncoder();

  /**
   * Helper class used to incrementally build a MIDI file from tracks.
   */
  class MidiFileEncoder {
    /**
     * Write a variable-length integer to the output.
     */
    static writeVarLen(output: ByteArrayOutput, value: number): void {
      let bytes: Array<byte> = [];
      while (value > 0x7f) {
        bytes.push((value & 0x7f) | 0x80);
        value >>= 7;
      }
      bytes.push(value & 0x7f);
      for (let i = bytes.length - 1; i >= 0; i--) {
        output.writeByte(bytes[i]);
      }
    }

    readonly #tracks: Array<MidiTrack> = [];

    /**
     * Add a track to the encoder.
     */
    addTrack(track: MidiTrack): this {
      this.#tracks.push(track);
      return this;
    }

    /**
     * Encode the added tracks into a MIDI file.
     */
    encode(): ByteArrayOutput {
      const output = ByteArrayOutput.create();
      output.littleEndian = false;
      output.writeInt(Chunk.MTHD);
      output.writeInt(6);
      output.writeShort(0); // formatType
      output.writeShort(this.#tracks.length);
      output.writeShort(96); // timeDivision
      this.#tracks.forEach((track) => {
        output.writeInt(Chunk.MTRK);
        const buffer = track.encode();
        output.writeInt(buffer.byteLength);
        output.writeBytes(new Int8Array(buffer));
      });
      return output;
    }
  }
}

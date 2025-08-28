/**
 * Synchronous stream helpers.
 */
import { ByteArrayInput, ByteArrayOutput } from "./data";
import { panic, Procedure, Provider } from "./lang";
import { Schema } from "./schema";

export namespace SyncStream {
  const enum State {
    READING,
    READ,
    WRITING,
    WRITTEN,
  }

  /**
   * Exposes a method that attempts to write structured data into a shared buffer.
   */
  export interface Writer {
    /** Attempts to serialise a value into the buffer. */
    readonly tryWrite: Provider<boolean>;
  }

  /**
   * Represents the reading side of a synchronous stream.
   */
  export interface Reader {
    /** Shared buffer populated by a corresponding {@link Writer}. */
    readonly buffer: SharedArrayBuffer;
    /** Attempts to read and deserialize the next value. */
    readonly tryRead: Provider<boolean>;
  }

  /**
   * Creates a {@link Writer} that serialises objects of type `T` into the provided buffer.
   *
   * @param io - Schema used to encode objects.
   * @param buffer - Shared memory backing the stream.
   * @param populate - Function that fills the schema's object prior to writing.
   */
  export const writer = <T extends object>(
    io: Schema.IO<T>,
    buffer: SharedArrayBuffer,
    populate: Procedure<T>,
  ): Writer => {
    if (io.bytesTotal + 1 > buffer.byteLength) {
      return panic("Insufficient memory allocated.");
    }
    const array = new Uint8Array(buffer);
    const output = ByteArrayOutput.use(buffer, 1);
    Atomics.store(array, 0, State.READ);
    return {
      tryWrite: () => {
        if (
          Atomics.compareExchange(array, 0, State.READ, State.WRITING) ===
          State.WRITING
        ) {
          populate(io.object);
          output.position = 0;
          io.write(output);
          Atomics.store(array, 0, State.WRITTEN);
          return true;
        }
        return false;
      },
    };
  };

  /**
   * Creates a {@link Reader} that deserialises objects of type `T` from a shared buffer.
   *
   * @param io - Schema used to decode objects.
   * @param procedure - Callback receiving each decoded instance.
   * @returns Reader exposing the shared buffer and a polling function.
   */
  export const reader = <T extends object>(
    io: Schema.IO<T>,
    procedure: Procedure<T>,
  ): Reader => {
    const buffer = new SharedArrayBuffer(io.bytesTotal + 1);
    const array = new Uint8Array(buffer);
    const input = new ByteArrayInput(buffer, 1);
    return {
      buffer,
      tryRead: () => {
        if (
          Atomics.compareExchange(array, 0, State.WRITTEN, State.READING) ===
          State.READING
        ) {
          input.position = 0;
          io.read(input);
          procedure(io.object);
          Atomics.store(array, 0, State.READ);
          return true;
        }
        return false;
      },
    };
  };
}

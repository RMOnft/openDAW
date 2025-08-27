import {
  ArrayMultimap,
  ByteArrayOutput,
  int,
  isDefined,
} from "@opendaw/lib-std";
import { Channel } from "./Channel";
import { ControlEvent } from "./ControlEvent";
import { MetaEvent, MetaType } from "./MetaType";
import { MidiFileDecoder } from "./MidiFileDecoder";
import { ControlType } from "./ControlType";

/**
 * Collection of MIDI control and meta events representing a single track.
 */
export class MidiTrack {
  /**
   * Decode a track from the given decoder.
   */
  static decode(decoder: MidiFileDecoder): MidiTrack {
    const controlEvents: ArrayMultimap<Channel, ControlEvent> =
      new ArrayMultimap<Channel, ControlEvent>();
    const metaEvents: Array<MetaEvent> = [];
    let ticks: int = 0;
    let eventType: int = 0;
    let channel: Channel = 0;
      // eslint-disable-next-line no-constant-condition
      while (true) {
      const varLen = decoder.readVarLen();
      const b = decoder.readByte() & 0xff;
      if (b < 0xf0) {
        // 0x00....0xEF (MidiControl)
        ticks += varLen;
        if (b < 0x80) {
          // running mode, use the last eventType/channel!
          decoder.skip(-1);
        } else {
          eventType = b & 0xf0;
          channel = b & 0x0f;
        }
        const event = ControlEvent.decode(decoder, eventType, ticks);
        if (isDefined(event)) {
          controlEvents.add(channel, event);
        }
      } else if (b < 0xf8) {
        decoder.skipSysEx(b); // 0xF0....0xF7
      } else {
        // 0xF8....0xFF
        ticks += varLen;
        const event: MetaEvent | null = MetaEvent.decode(decoder, ticks);
        if (event !== null) {
          metaEvents.push(event);
          if (event.type === MetaType.END_OF_TRACK) {
            break;
          }
        }
      }
    }
    return new MidiTrack(controlEvents, metaEvents);
  }

  /** Create an empty track with no events. */
  static createEmpty(): MidiTrack {
    return new MidiTrack(new ArrayMultimap<Channel, ControlEvent>(), []);
  }

  constructor(
    readonly controlEvents: ArrayMultimap<Channel, ControlEvent>,
    readonly metaEvents: Array<MetaEvent>,
  ) {}

  /**
   * Encode the track into a MIDI track chunk.
   */
  encode(): ArrayBufferLike {
    const output = ByteArrayOutput.create();
    const writeVarInt = (value: int): void => {
      if (value <= 0x7f) {
        output.writeByte(value);
      } else {
        let i = value;
        const bytes: Array<int> = [];
        bytes.push(i & 0x7f);
        i >>= 7;
          while (i) {
            const b = (i & 0x7f) | 0x80;
            bytes.push(b);
            i >>= 7;
          }
        bytes.reverse().forEach((byte) => output.writeByte(byte));
      }
    };
    this.controlEvents.forEach((channel, events) => {
        let ticks = 0;
        let lastEventTypeByte = -1;
      events.forEach((event: ControlEvent) => {
        const deltaTime = event.ticks - ticks;
        writeVarInt(deltaTime);
        if (event.type === ControlType.NOTE_ON) {
          const eventTypeByte = 0x90 | channel;
            if (eventTypeByte !== lastEventTypeByte) {
              output.writeByte(eventTypeByte);
              lastEventTypeByte = eventTypeByte;
            }
          output.writeByte(event.param0);
          output.writeByte(event.param1);
        } else if (event.type === ControlType.NOTE_OFF) {
          const eventTypeByte = 0x90 | channel;
            if (eventTypeByte !== lastEventTypeByte) {
              output.writeByte(eventTypeByte);
              lastEventTypeByte = eventTypeByte;
            }
          output.writeByte(event.param0);
          output.writeByte(event.param1);
        } else {
          console.warn("Unknown ControlType");
        }
        ticks = event.ticks;
      });
    });

    return output.toArrayBuffer();
  }
}

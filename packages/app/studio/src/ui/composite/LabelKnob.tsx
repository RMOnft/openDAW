import { Lifecycle, unitValue } from "@opendaw/lib-std";
import { Knob } from "@/ui/components/Knob.tsx";
import { ParameterLabel } from "@/ui/components/ParameterLabel.tsx";
import { createElement } from "@opendaw/lib-jsx";
import {
  AutomatableParameterFieldAdapter,
  DeviceBoxAdapter,
} from "@opendaw/studio-adapters";
import { Editing } from "@opendaw/lib-box";
import { MIDILearning } from "@/midi/devices/MIDILearning";

/** Props for {@link LabelKnob}. */
export interface LabelKnobProps {
  /** Lifecycle owner managing the component. */
  lifecycle: Lifecycle;
  /** Editing state for enabling inline editing. */
  editing: Editing;
  /** MIDI learning controller used for mappings. */
  midiDevices: MIDILearning;
  /** Adapter providing context about the device box. */
  adapter: DeviceBoxAdapter;
  /** Parameter displayed and controlled by the knob. */
  parameter: AutomatableParameterFieldAdapter;
  /** Anchor value for the knob's indicator. */
  anchor: unitValue;
}

/**
 * Combines {@link Knob} with its {@link ParameterLabel}.
 *
 * @param lifecycle - manages subscriptions
 * @param parameter - parameter controlled by the knob
 */
export const LabelKnob = ({
  lifecycle,
  editing,
  midiDevices,
  adapter,
  parameter,
  anchor,
}: LabelKnobProps) => {
  return (
    <div style={{ display: "contents" }}>
      <Knob lifecycle={lifecycle} value={parameter} anchor={anchor} />
      <ParameterLabel
        lifecycle={lifecycle}
        editing={editing}
        midiLearning={midiDevices}
        adapter={adapter}
        parameter={parameter}
      />
    </div>
  );
};

/** Property table for {@link LabelKnob}. */
export const LabelKnobPropTable = [
  {
    prop: "lifecycle",
    type: "Lifecycle",
    description: "Owner used to dispose subscriptions.",
  },
  {
    prop: "editing",
    type: "Editing",
    description: "Editing state for inline parameter changes.",
  },
  {
    prop: "midiDevices",
    type: "MIDILearning",
    description: "MIDI learning controller.",
  },
  {
    prop: "adapter",
    type: "DeviceBoxAdapter",
    description: "Context of the device box.",
  },
  {
    prop: "parameter",
    type: "AutomatableParameterFieldAdapter",
    description: "Parameter displayed and edited.",
  },
  {
    prop: "anchor",
    type: "unitValue",
    description: "Anchor value for the knob indicator.",
  },
] as const;

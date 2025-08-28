/** @file Displays the current value of an automatable parameter. */
import css from "./ParameterLabel.sass?inline";
import { ControlSource, Lifecycle, Terminable } from "@opendaw/lib-std";
import { createElement } from "@opendaw/lib-jsx";
import { attachParameterContextMenu } from "@/ui/menu/automation.ts";
import {
  AutomatableParameterFieldAdapter,
  DeviceBoxAdapter,
} from "@opendaw/studio-adapters";
import { Editing } from "@opendaw/lib-box";
import { Html } from "@opendaw/lib-dom";
import { MIDILearning } from "@/midi/devices/MIDILearning";

const className = Html.adoptStyleSheet(css, "ParameterLabel");

/** Props for {@link ParameterLabel}. */
export interface ParameterLabelProps {
  /** Lifecycle owner for subscriptions. */
  lifecycle: Lifecycle;
  /** Editing context used for undo/redo integration. */
  editing: Editing;
  /** MIDI learning helper. */
  midiLearning: MIDILearning;
  /** Owning device adapter. */
  adapter: DeviceBoxAdapter;
  /** Parameter represented by the label. */
  parameter: AutomatableParameterFieldAdapter;
  /** Draw a frame around the label. */
  framed?: boolean;
  /** Whether to attach a context menu standalone. */
  standalone?: boolean;
}

/** Displays the current value of an automatable parameter. */
export const ParameterLabel = ({
  lifecycle,
  editing,
  midiLearning,
  adapter,
  parameter,
  framed,
  standalone,
}: ParameterLabelProps): HTMLLabelElement => {
  const element: HTMLLabelElement = (
    <label className={Html.buildClassList(className, framed && "framed")} />
  );
  const onValueChange = (adapter: AutomatableParameterFieldAdapter) => {
    const printValue = adapter.stringMapping.x(
      adapter.valueMapping.y(adapter.getControlledUnitValue()),
    );
    element.textContent = printValue.value;
    element.setAttribute("unit", printValue.unit);
  };
  lifecycle.ownAll(
    standalone === true
      ? attachParameterContextMenu(
          editing,
          midiLearning,
          adapter.deviceHost().audioUnitBoxAdapter().tracks,
          parameter,
          element,
        )
      : Terminable.Empty,
    parameter.catchupAndSubscribeControlSources({
      onControlSourceAdd: (source: ControlSource) =>
        element.classList.add(source),
      onControlSourceRemove: (source: ControlSource) =>
        element.classList.remove(source),
    }),
    parameter.subscribe(onValueChange),
  );
  onValueChange(parameter);
  return element;
};

/** Property table for {@link ParameterLabel}. */
export const ParameterLabelPropTable = [
  {
    prop: "lifecycle",
    type: "Lifecycle",
    description: "Owner used to dispose subscriptions.",
  },
  {
    prop: "editing",
    type: "Editing",
    description: "Editing context for undo/redo.",
  },
  {
    prop: "midiLearning",
    type: "MIDILearning",
    description: "MIDI learn helper.",
  },
  {
    prop: "adapter",
    type: "DeviceBoxAdapter",
    description: "Owning device adapter.",
  },
  {
    prop: "parameter",
    type: "AutomatableParameterFieldAdapter",
    description: "Parameter displayed by the label.",
  },
  {
    prop: "framed",
    type: "boolean",
    description: "Draw a frame around the label.",
  },
  {
    prop: "standalone",
    type: "boolean",
    description: "Attach context menu standalone.",
  },
] as const;

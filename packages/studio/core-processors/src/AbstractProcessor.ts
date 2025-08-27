import {
  Arrays,
  Option,
  panic,
  Terminable,
  TerminableOwner,
  Terminator,
} from "@opendaw/lib-std";
import { PointerField, PrimitiveValues } from "@opendaw/lib-box";
import { Pointers } from "@opendaw/studio-enums";
import { AutomatableParameterFieldAdapter } from "@opendaw/studio-adapters";
import { AutomatableParameter } from "./AutomatableParameter";
import { ProcessInfo, Processor } from "./processing";
import { EngineContext } from "./EngineContext";
import { EventBuffer } from "./EventBuffer";

/**
 * Base class for all engine processors.
 *
 * Provides parameter binding, automation support and wiring for the
 * {@link UpdateClock}. Subclasses typically implement {@link reset} and
 * {@link process}.
 *
 * Error Handling: by default, unexpected parameter updates invoke
 * {@link panic}. Subclasses may throw from {@link process} or {@link reset} to
 * signal unrecoverable errors.
 */
export abstract class AbstractProcessor
  implements Processor, TerminableOwner, Terminable
{
  readonly #terminator = new Terminator();
  readonly #context: EngineContext;
  readonly #eventInput: EventBuffer;
  readonly #parameters: Array<AutomatableParameter>;
  readonly #automatedParameters: Array<AutomatableParameter>;

  #updateClockConnection: Option<Terminable> = Option.None;

  constructor(context: EngineContext) {
    this.#context = context;
    this.#eventInput = new EventBuffer();
    this.#parameters = [];
    this.#automatedParameters = [];
  }

  abstract reset(): void;
  abstract process(processInfo: ProcessInfo): void;

  /**
   * Called whenever a bound {@link AutomatableParameter} changes.
   *
   * Sub-classes override this to react to parameter updates.
   */
  parameterChanged(parameter: AutomatableParameter): void {
    return panic(
      `Got update event for ${parameter}, but has no parameter change method`,
    );
  }

  get context(): EngineContext {
    return this.#context;
  }
  get eventInput(): EventBuffer {
    return this.#eventInput;
  }

  /**
   * Creates an {@link AutomatableParameter} for the given adapter and wires it
   * to the update clock so that automation events are received.
   */
  bindParameter<T extends PrimitiveValues>(
    adapter: AutomatableParameterFieldAdapter<T>,
  ): AutomatableParameter<T> {
    const parameter = new AutomatableParameter<T>(this.#context, adapter);
    parameter.ownAll(
      adapter.field.pointerHub.catchupAndSubscribeTransactual(
        {
          onAdd: (_pointer: PointerField) => {
            if (this.#updateClockConnection.isEmpty()) {
              this.#updateClockConnection = Option.wrap(
                this.#context.updateClock.addEventOutput(this.#eventInput),
              );
            }
            this.#automatedParameters.push(parameter);
            parameter.onStartAutomation();
          },
          onRemove: (_pointer: PointerField) => {
            Arrays.remove(this.#automatedParameters, parameter);
            if (this.#automatedParameters.length === 0) {
              this.#updateClockConnection.ifSome((connection) =>
                connection.terminate(),
              );
              this.#updateClockConnection = Option.None;
            }
            parameter.onStopAutomation();
          },
        },
        Pointers.Automation,
      ),
      parameter.subscribe(() => this.parameterChanged(parameter)),
    );
    this.#parameters.push(parameter);
    return parameter;
  }

  /**
   * Updates all automated parameters to the given song position.
   */
  updateParameter(position: number): void {
    this.#automatedParameters.forEach((parameter: AutomatableParameter) => {
      if (parameter.updateAutomation(position)) {
        this.parameterChanged(parameter);
      }
    });
  }

  /**
   * Forces {@link parameterChanged} to be invoked for all bound parameters.
   */
  readAllParameters(): void {
    this.#parameters.forEach((parameter) => this.parameterChanged(parameter));
  }

  /**
   * Utility methods delegating to the internal {@link Terminator} to manage
   * child resources.
   */
  own<T extends Terminable>(terminable: T): T {
    return this.#terminator.own(terminable);
  }
  ownAll<T extends Terminable>(...terminables: T[]): void {
    return this.#terminator.ownAll(...terminables);
  }
  spawn(): Terminator {
    return this.#terminator.spawn();
  }

  /**
   * Tears down the processor and all owned resources.
   */
  terminate(): void {
    this.#updateClockConnection.ifSome((connection) => connection.terminate());
    this.#updateClockConnection = Option.None;
    this.#parameters.length = 0;
    this.#terminator.terminate();
  }

  toString(): string {
    return `{${this.constructor.name}}`;
  }
}

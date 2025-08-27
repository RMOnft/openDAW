import { AutomatableParameterFieldAdapter } from "@opendaw/studio-adapters";
import { Editing, PrimitiveValues } from "@opendaw/lib-box";
import {
  MutableObservableValue,
  ObservableValue,
  Observer,
  Subscription,
} from "@opendaw/lib-std";

/** Bridges mutable observable values with the editing history system. */
export namespace EditWrapper {
  /** Wraps a plain {@link MutableObservableValue} so modifications go through {@link Editing}. */
  export const forValue = <T extends PrimitiveValues>(
    editing: Editing,
    owner: MutableObservableValue<T>,
  ): MutableObservableValue<T> =>
    new (class implements MutableObservableValue<T> {
      getValue(): T {
        return owner.getValue();
      }
      setValue(value: T) {
        editing.modify(() => owner.setValue(value));
      }
      subscribe(observer: Observer<ObservableValue<T>>): Subscription {
        return owner.subscribe(() => observer(this));
      }
      catchupAndSubscribe(
        observer: Observer<ObservableValue<T>>,
      ): Subscription {
        return owner.catchupAndSubscribe(observer);
      }
    })();

  /**
   * Creates a value wrapper for a parameter that can also be automated.
   * Direct changes outside of an editing session are applied immediately.
   */
  export const forAutomatableParameter = <T extends PrimitiveValues>(
    editing: Editing,
    adapter: AutomatableParameterFieldAdapter<T>,
  ): MutableObservableValue<T> =>
    new (class implements MutableObservableValue<T> {
      getValue(): T {
        return adapter.getControlledValue();
      }
      setValue(value: T) {
        if (editing.canModify()) {
          editing.modify(() => adapter.setValue(value));
        } else {
          adapter.setValue(value);
        }
      }
      subscribe(observer: Observer<ObservableValue<T>>): Subscription {
        return adapter.subscribe(() => observer(this));
      }
      catchupAndSubscribe(
        observer: Observer<ObservableValue<T>>,
      ): Subscription {
        return adapter.catchupAndSubscribe(observer);
      }
    })();
}

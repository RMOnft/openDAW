import css from "./DropDown.sass?inline";
import {
  Func,
  Lifecycle,
  MutableObservableValue,
  Provider,
} from "@opendaw/lib-std";
import { MenuButton } from "@/ui/components/MenuButton.tsx";
import { createElement, Inject } from "@opendaw/lib-jsx";
import { MenuItem } from "@/ui/model/menu-item.ts";
import { Appearance } from "../components/ButtonCheckboxRadio";
import { IconSymbol } from "@opendaw/studio-adapters";
import { Icon } from "@/ui/components/Icon";
import { Html } from "@opendaw/lib-dom";
import { Colors } from "@opendaw/studio-core";

const className = Html.adoptStyleSheet(css, "DropDown");

/** Props for {@link DropDown}. */
export interface DropDownProps<T> {
  /** Lifecycle owner managing subscriptions. */
  lifecycle: Lifecycle;
  /** Mutable value representing the current selection. */
  owner: MutableObservableValue<T>;
  /** Supplies the available menu items. */
  provider: Provider<Iterable<T>>;
  /** Maps a value to its display label. */
  mapping: Func<T, string>;
  /** Optional visual appearance for the underlying {@link MenuButton}. */
  appearance?: Appearance;
  /** Minimum width for the label element. */
  width?: string;
}

/**
 * Renders a drop-down menu using {@link MenuButton} and {@link MenuItem} entries.
 *
 * @param lifecycle - manages cleanup of subscriptions
 * @param owner - observable value holding the selection
 * @param provider - returns the list of selectable values
 * @param mapping - converts values to labels
 */
export const DropDown = <T,>({
  lifecycle,
  owner,
  provider,
  mapping,
  appearance,
  width,
}: DropDownProps<T>) => {
  const injectLabel = Inject.value(mapping(owner.getValue()));
  lifecycle.own(
    owner.subscribe((owner) => {
      injectLabel.value = mapping(owner.getValue());
    }),
  );
  return (
    <div className={className}>
      <MenuButton
        root={MenuItem.root().setRuntimeChildrenProcedure((parent) => {
          for (const value of provider()) {
            parent.addMenuItem(
              MenuItem.default({
                label: mapping(value),
                checked: value === owner.getValue(),
              }).setTriggerProcedure(() => owner.setValue(value)),
            );
          }
        })}
        appearance={
          appearance ?? {
            framed: true,
            color: Colors.dark,
            activeColor: Colors.gray,
          }
        }
      >
        <label style={{ minWidth: width ?? "unset" }}>
          {injectLabel}
          <Icon symbol={IconSymbol.Dropdown} />
        </label>
      </MenuButton>
    </div>
  );
};

/** Property table for {@link DropDown}. */
export const DropDownPropTable = [
  {
    prop: "lifecycle",
    type: "Lifecycle",
    description: "Manages subscriptions for cleanup.",
  },
  {
    prop: "owner",
    type: "MutableObservableValue<T>",
    description: "Holds the current selection.",
  },
  {
    prop: "provider",
    type: "Provider<Iterable<T>>",
    description: "Supplies the available values.",
  },
  {
    prop: "mapping",
    type: "Func<T, string>",
    description: "Maps each value to a label.",
  },
  {
    prop: "appearance",
    type: "Appearance",
    description: "Visual style for the MenuButton.",
  },
  {
    prop: "width",
    type: "string",
    description: "Minimum width for the label.",
  },
] as const;

## Effect editors

Effect devices share a common set of context menu items for enabling,
reordering and inserting new effects. The `MenuItems` helpers provide these
actions and are used by every effect editor.

Each specific effect (delay, reverb, etc.) implements its own set of controls
while being wrapped by `DeviceEditor` to obtain the standard header and meter.


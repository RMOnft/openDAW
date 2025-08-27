## Device UI FAQ

### Why does my effect not appear in the panel?

Ensure the device is wrapped by `DeviceEditor` and that the host adds the
adapter to the correct effect collection so the panel can mount it.

### How do I add custom menu actions?

Extend the `MenuItems` helpers or provide a `populateMenu` callback when using
`DeviceEditor` to append additional `MenuItem` entries.


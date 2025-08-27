# Using Studio Enums

Import enumerations from `@opendaw/studio-enums` wherever consistent values are
required.

```ts
import {AudioSendRouting, AudioUnitType, Pointers} from '@opendaw/studio-enums';

// connect a device host
box.host.refer(hostField as Pointers.InstrumentHost);

// configure an audio unit
audioUnit.type.setValue(AudioUnitType.Output);

// route a send post-fader
send.routing.setValue(AudioSendRouting.Post);
```


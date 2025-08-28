# Device parameters

Processors expose their adjustable parameters through exported tables. Each table lists the parameter name, its type and a short description. The tables live next to the processor implementations and can be imported by tooling or documentation generators.

```ts
import { DelayDeviceProcessorParamTable } from '@opendaw/studio-core-processors';

DelayDeviceProcessorParamTable.forEach(p => {
  console.log(p.param, p.description);
});
```

The following processors currently define parameter tables:

- DelayDeviceProcessor
- ReverbDeviceProcessor
- RevampDeviceProcessor
- StereoToolDeviceProcessor
- NopDeviceProcessor (no parameters)
- ArpeggioDeviceProcessor
- PitchDeviceProcessor
- ZeitgeistDeviceProcessor (no parameters)

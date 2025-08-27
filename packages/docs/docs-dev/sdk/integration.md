# SDK Integration

Install the package and reference the desired interfaces in your code.

```bash
npm install @opendaw/studio-sdk
```

```ts
import { ProjectAPI } from '@opendaw/studio-sdk';

declare const project: ProjectAPI;
await project.load('example');
```

Integration is interface-driven; the concrete implementation is supplied
by the host environment, allowing applications to interact with the
studio without depending on internal modules.

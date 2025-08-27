# SDK Examples

```ts
import {
  ProjectAPI,
  TransportAPI,
} from '@opendaw/studio-sdk';

declare const project: ProjectAPI;
declare const transport: TransportAPI;

await project.create('Demo Project');
transport.play();
```

The example above creates a new project and starts playback using the
transport API. Each interface focuses on a specific concern so your
application can import only what it needs.

# Examples

```ts
import {createElement, Inject} from '@opendaw/lib-jsx'

const message = Inject.value('Hello')

document.body.append(
  createElement('div', null, message)
)
```

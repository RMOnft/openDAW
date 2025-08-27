# Routing

The library offers simple routing via `RouteLocation` and `RouteMatcher`. `RouteLocation` monitors the browser's location, while `RouteMatcher` resolves paths against a list of routes.

```ts
import {RouteLocation, RouteMatcher} from '@opendaw/lib-jsx'

const routes = [{ path: '/' }, { path: '/about' }]
const matcher = RouteMatcher.create(routes)

RouteLocation.get().catchupAndSubscribe(loc => {
  console.log('route', matcher.resolve(loc.path))
})
```

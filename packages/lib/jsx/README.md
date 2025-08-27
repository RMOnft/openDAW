_This package is part of the openDAW SDK_

# @opendaw/lib-jsx

JSX utilities and components for TypeScript projects with DOM manipulation.

## Usage

```ts
import {createElement, Inject, RouteLocation, RouteMatcher} from '@opendaw/lib-jsx'

const counter = Inject.value(0)

const button = createElement('button', {
    onClick: () => counter.value++,
}, 'Increment')

// Bind the reactive value as text content
const label = createElement('span', null, counter)

document.body.append(button, label)

// Simple routing example
type AppRoute = { path: string, title: string }
const matcher = RouteMatcher.create<AppRoute>([
    { path: '/', title: 'Home' },
    { path: '/about', title: 'About' },
])

RouteLocation.get().catchupAndSubscribe(loc => {
    const route = matcher.resolve(loc.path)
    console.log('navigated to', route?.path)
})
```

## Core JSX

* **create-element.ts** - JSX element creation and factory functions
* **types.ts** - TypeScript type definitions for JSX
* **inject.ts** - Dependency injection utilities for JSX components

## Component System

* **weak.ts** - Weak reference utilities for components
* **routes.ts** - Routing utilities and navigation
* **supported-svg-tags.ts** - SVG tag support definitions

## Standard Components

* **Frag.tsx** - Fragment component for grouping elements
* **Group.tsx** - Grouping component with enhanced functionality
* **Await.tsx** - Async component for handling promises
* **Router.tsx** - Router component for navigation
* **Hotspot.tsx** - Interactive hotspot component
* **LocalLink.tsx** - Local navigation link component
* **Preloader.tsx** - Loading and preloading component

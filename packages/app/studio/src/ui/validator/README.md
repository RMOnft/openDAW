## Validator UI Module

Utilities for validating user input in the Studio.

- **validator.ts** – defines the generic `Validator` and `Result` interfaces.
- **name.ts** – provides a `NameValidator` enforcing 1–64 character names.

Use these helpers to ensure form components provide immediate feedback.

```ts
NameValidator.validate("Demo", {
  success: (value) => console.log(value),
  failure: () => console.error("Invalid"),
});
```

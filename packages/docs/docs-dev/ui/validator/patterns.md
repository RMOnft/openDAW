# Validator Patterns

Validators encapsulate form validation logic.

## Basic usage

```ts
NameValidator.validate(input.value, {
  success: (value) => console.log(value),
  failure: () => alert("Invalid name"),
});
```

## Creating custom validators

```ts
const NonEmpty: Validator<string> = {
  validate: (value, match) => {
    if (value.trim()) {
      match.success(value);
    } else {
      match.failure?.();
    }
  },
};
```

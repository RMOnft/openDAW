# Migration

When migrating existing tools or projects to DAWproject, start by mapping your data structures to the classes in
`@opendaw/lib-dawproject`. The utility functions in `src/utils.ts` can help encode parameters in the correct format.

1. Identify corresponding schema classes.
2. Serialize your data with `Xml.element` and the provided schemas.
3. Validate output using the tests or example projects.

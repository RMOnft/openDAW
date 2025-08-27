# Style Customization

openDAW's appearance can be adjusted by overriding the CSS variables defined in
[`colors.sass`](../../../packages/app/studio/src/colors.sass). Variables and
class names use kebab-case such as `--color-green` or `.help-section`.

To create a custom theme:

1. Fork or clone the repository.
2. Edit the desired variables in `colors.sass` or provide your own stylesheet
   that overrides them.
3. Rebuild the app to apply your changes.

For more details see the [developer style guide](../docs-dev/style-guide.md) and
the central [style guidelines](../../../styles/OpenDAW/style-guidelines.md).

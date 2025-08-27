# Style Customization

openDAW's appearance can be adjusted by overriding the CSS variables defined in
[`colors.sass`](../../../packages/app/studio/src/colors.sass). Variables and
class names use kebab-case such as `--color-green` or `.help-section`. The
TypeScript layer reads these values through
[`Colors.ts`](../../studio/core/src/Colors.ts), so any changes cascade through
all components.


The default UI uses the **Rubik** and **Open Sans** typefaces from [`packages/app/studio/public/fonts`](../../../packages/app/studio/public/fonts). These fonts are provided under the [SIL Open Font License 1.1](https://scripts.sil.org/OFL). Replace these files or override the CSS `font-family` to customize text appearance.

To create a custom theme:

1. Fork or clone the repository.
2. Edit the desired variables in `colors.sass` or provide your own stylesheet
   that overrides them. For example, to adjust the primary accent colour:

   ```css
   :root {
     --color-blue: hsl(210, 100%, 60%);
   }
   ```
3. Rebuild the app to apply your changes.

For more details see the [developer style guide](../docs-dev/style-guide.md) and
the central [style guidelines](../../../styles/OpenDAW/style-guidelines.md).

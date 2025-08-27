# Writing Guide

Use this guide when contributing documentation.

## Voice and tone

- Use friendly, inclusive language.
- Write in the second person and active voice.
- Keep sentences short—aim for 20 words or fewer.
- Prefer simple words and the present tense.

## Formatting

- Structure pages with incremental Markdown headings.
- Use sentence case for headings.
- Wrap code and commands in backticks.
- Provide alt text for all images.
- Link to related topics using relative paths.

## Tips

- Provide code fences for commands or snippets.
- Call out input constraints where validators apply, such as the name
  validator used when creating projects.

These practices align with our Markdown linting and Vale configuration. Page
owners listed in the [ownership map](../documentation-site/ownership-map.md)
drive reviews and updates.

## Review cadence

- Pages owned by active teams are reviewed **monthly**.
- The entire documentation set is audited **quarterly** for accuracy and
  broken links.

## Versioning strategy

- Documentation follows the project’s release tags.
- `main` reflects work for the next release; stable versions are stored under
  `versioned_docs/`.
- Deprecated pages are archived rather than deleted.

For naming conventions of colours and other UI variables, refer to the [Design
Tokens](./design-tokens.md) guide.


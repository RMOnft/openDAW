# Troubleshooting

## FAQ

### I can't hear any sound

- Ensure your computer's volume is up and the track is not muted.
- Check browser permissions and select the correct audio output device.

### Microphone input doesn't work

- Verify the browser has permission to use your microphone.
- Choose the correct input device in openDAW's audio settings.

### The project won't load or crashes

- Clear the browser cache and reload the page.
- If the issue persists, try opening the project in a new browser session.

### Performance is slow or glitches

- Close other browser tabs or applications to free resources.
- Lower the audio buffer size only if your system can handle it.

### Audio drops out or lags

- Increase the audio buffer size in settings to give the CPU more time.
- Ensure no other applications are using significant CPU resources.

### How do I reset openDAW to defaults?

- Delete cached data in the browser's site settings and reload openDAW.

### Browser denies microphone access

- Check browser permissions and allow access when prompted.
- Verify that the correct input device is selected in audio settings.

### openDAW reports that a feature is missing

- Some browsers lack APIs required by the Studio. If you see a warning
  about a missing feature, upgrade to the latest version of Chrome,
  Edge, Firefox or Safari.
- Older versions of the above browsers may also omit support for
  required features. Updating usually resolves the issue.

### I see an "Update available" banner

- The application fetched a newer build. Reload the page to switch to
  the latest version.
- If the message persists after reloading, try clearing the browser
  cache.

### Reporting errors

- When an unexpected error dialog appears, note the steps that led to the
  issue and send them to support using the built-in error report template.

- Developers looking to diagnose issues in depth can consult the
  [debugging guide](/dev/debugging/overview).

### How do I collect logs for support?

- The Studio automatically captures recent console output and sends it along
  with error reports. You can also export a project `SyncLog` from the footer
  menu to share a history of your edits.

### App stuck on loading screen

- Check your internet connection and reload the page.
- Make sure a supported browser is used and that extensions aren't blocking the app.

### I see a "Missing Feature" message

- Update the browser to the latest version or try a different one.
- If the message persists, report it to support with your browser details.

### How do I review past changes?

- Consult the [project history guide](workflows/history.md) for working with
  SyncLog files.

## Build from Source

If you're running the project locally, use these commands from the repository root:

```bash
npm run install:deps
npm install
npm run build
npm test
npm run docs:dev    # local docs preview
npm run docs:build  # static docs output
```

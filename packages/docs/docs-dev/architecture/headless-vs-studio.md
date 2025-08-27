# Headless vs Studio

The headless demo and the Studio app share the same audio engine but expose it differently.

## Bootstrapping

The headless entry point installs worker agents, verifies required browser APIs, and loads an example project directly from code before starting playback.

`StudioService` performs a similar initialization but adds orchestration for UI panels, session management and transport control.

## Project creation

The demo builds a small arpeggiated project in code using factory helpers, while the Studio app expects projects to be created through its editing interfaces.

## Sample API

Both builds use the same REST helpers for listing, retrieving and decoding samples. The Studio service adds an `upload` endpoint for pushing new samples to the server.

## Summary

Headless mode demonstrates core engine parity with the Studio service but omits UI-centric features. It is suited for embedding or automated tests, whereas the Studio app provides the full workspace and audio workflow.


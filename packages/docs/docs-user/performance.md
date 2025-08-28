# Performance Guide

openDAW is designed to remain responsive even in large sessions. Close other
applications and browser tabs if you encounter glitches. Increasing the audio
buffer size in settings can give the CPU more time to process complex
arrangements.

The engine streams audio between threads using shared-memory ring buffers. This
avoids expensive structured cloning and keeps latency low. For a deep dive into
the design, see the [ring buffer architecture
notes](../docs-dev/architecture/ring-buffers.md).

# Randomness

Utilities for non‑cryptographic randomness live in `random.ts` and are backed
by the fast Mulberry32 PRNG.  The `uuid.ts` module builds upon this to generate
RFC‑4122 compliant UUIDv4 values and to hash arbitrary data into deterministic
IDs.

These helpers are intended for simulations, tests and procedural generation
rather than security sensitive tasks.

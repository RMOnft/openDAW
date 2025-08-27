# Performance

Use transferable objects and avoid copying large audio buffers. Workers should
stream results incrementally to keep the UI responsive.

# Weak References

To avoid memory leaks, the library stores DOM references in `WeakRefSet`. Injection helpers such as `Inject.value` and `Inject.classList` rely on weak references so elements can be garbage collected when removed from the DOM.

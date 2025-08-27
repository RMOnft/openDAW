/**
 * Convenience wrapper around the global CSS design tokens.
 *
 * Values are defined in the Studio's `colors.sass` palette and documented in
 * `styles/OpenDAW/style-guidelines.md`. Importing this map allows components to
 * access pre-resolved color values without repeatedly querying the DOM.
 */
const computedStyle = getComputedStyle(document.documentElement)

export const Colors = {
    // Accent blue used for links and active states
    blue: computedStyle.getPropertyValue("--color-blue"),
    // Confirmation and success highlight
    green: computedStyle.getPropertyValue("--color-green"),
    // Warning and caution tone
    yellow: computedStyle.getPropertyValue("--color-yellow"),
    // Neutral cream for subtle surfaces
    cream: computedStyle.getPropertyValue("--color-cream"),
    // Secondary accent orange
    orange: computedStyle.getPropertyValue("--color-orange"),
    // Error and destructive action color
    red: computedStyle.getPropertyValue("--color-red"),
    // Decorative purple accent
    purple: computedStyle.getPropertyValue("--color-purple"),
    // Brightest text color
    bright: computedStyle.getPropertyValue("--color-bright"),
    // Default interface text color
    gray: computedStyle.getPropertyValue("--color-gray"),
    // Muted text or disabled elements
    dark: computedStyle.getPropertyValue("--color-dark"),
    // Shadow and border color
    shadow: computedStyle.getPropertyValue("--color-shadow"),
    // Deepest shadow tone
    black: computedStyle.getPropertyValue("--color-black"),
}


import { Browser, Html, ModfierKeys } from "@opendaw/lib-dom";
import css from "./Markdown.sass?inline";
import { isDefined } from "@opendaw/lib-std";
import { createElement, RouteLocation } from "@opendaw/lib-jsx";
import markdownit from "markdown-it";
import { markdownItTable } from "markdown-it-table";

/**
 * Shared stylesheet name used by the {@link Markdown} component and related
 * helpers. The style sheet ensures consistent rendering of markdown content
 * across the Studio.
 */
const className = Html.adoptStyleSheet(css, "Markdown");

/**
 * Construction parameters for the {@link Markdown} JSX component.
 */
type Construct = {
  /** Raw markdown text to render. */
  text: string;
};

/**
 * Converts markdown text into HTML and injects it into the supplied element.
 *
 * The renderer performs several quality‑of‑life enhancements:
 *
 * - Rewrites keyboard modifier symbols for the current platform.
 * - Enables the markdown-it table plugin.
 * - Forces images to be CORS friendly and fit within their container.
 * - Routes internal links through the application's router.
 * - Adds copy‑to‑clipboard behaviour to code blocks.
 *
 * @param element - Target element that will receive the rendered HTML.
 * @param text - Markdown source to render.
 */
export const renderMarkdown = (element: HTMLElement, text: string) => {
  if (Browser.isWindows()) {
    Object.entries(ModfierKeys.Mac).forEach(
      ([key, value]) =>
        (text = text.replaceAll(value, (ModfierKeys.Win as any)[key])),
    );
  }
  const md = markdownit();
  md.use(markdownItTable);
  element.innerHTML = md.render(text);
  // Ensure images scale within the container and do not trigger CORS errors
  // when used in canvases.
  element.querySelectorAll("img").forEach((img) => {
    img.crossOrigin = "anonymous";
    img.style.maxWidth = "100%";
    if (!img.hasAttribute("alt")) {
      img.alt = "";
    }
  });
  // Intercept relative links and delegate navigation to the router so the
  // entire application is not reloaded.
  element.querySelectorAll("a").forEach((a) => {
    const url = new URL(a.href);
    if (url.origin === location.origin) {
      a.onclick = (event: Event) => {
        event.preventDefault();
        RouteLocation.get().navigateTo(url.pathname);
      };
    } else {
      a.target = "_blank";
    }
  });
  // Allow code blocks to be copied to the clipboard with a single click.
  element.querySelectorAll("code").forEach((code) => {
    code.title = "Click to copy to clipboard";
    code.onclick = () => {
      if (isDefined(code.textContent)) {
        navigator.clipboard.writeText(code.textContent);
        alert("Copied to clipboard");
      }
    };
  });
};

/**
 * JSX component rendering sanitized markdown inside a styled container.
 *
 * @param text - Markdown string to display.
 * @returns The resulting DOM element.
 */
export const Markdown = ({ text }: Construct) => {
  if (text.startsWith("<")) {
    return "Invalid Markdown";
  }
  const element: HTMLElement = (
    <div
      className={Html.buildClassList(className, "markdown")}
      role="article"
      aria-label="Markdown content"
    />
  );
  renderMarkdown(element, text);
  return element;
};

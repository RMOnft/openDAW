/**
 * Structured payload sent when reporting an error.
 */
import { int } from "@opendaw/lib-std";
import { BuildInfo } from "@/BuildInfo.ts";
import { LogBuffer } from "@/errors/LogBuffer.ts";
import { ErrorInfo } from "@/errors/ErrorInfo.ts";

/** Payload sent when reporting runtime errors from the Studio. */
export type ErrorLog = {
  /** ISO timestamp when the error was captured. */
  date: string;
  /** Browser user agent of the reporter. */
  agent: string;
  /** Build information for the running application. */
  build: BuildInfo;
  /**
   * Number of `<script>` elements on the current page.
   *
   * A higher count than expected can hint at browser extensions
   * injecting code and causing interference.
   */
  scripts: int;
  /** Normalized error information. */
  error: ErrorInfo;
  /** Recent console log entries captured before the error. */
  logs: Array<LogBuffer.Entry>;
};

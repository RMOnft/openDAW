/**
 * Captures global errors and reports them to the logging service.
 */
import { EmptyExec, Terminable, Terminator, Warning } from "@opendaw/lib-std";
import { AnimationFrame, Browser, Events } from "@opendaw/lib-dom";
import { LogBuffer } from "@/errors/LogBuffer.ts";
import { ErrorLog } from "@/errors/ErrorLog.ts";
import { ErrorInfo } from "@/errors/ErrorInfo.ts";
import { Surface } from "@/ui/surface/Surface.tsx";
import { StudioService } from "@/service/StudioService.ts";
import { showErrorDialog, showInfoDialog } from "@/ui/components/dialogs.tsx";

/**
 * Global error handler for the Studio. Captures unexpected errors and
 * unhandled promise rejections, forwards logs to the server and shows a user
 * facing dialog.
 */
export class ErrorHandler {
  /** Collects listeners that need to be disposed when the handler stops. */
  readonly terminator = new Terminator();
  readonly #service: StudioService;

  /** Guard to avoid infinite error loops once an error has been processed. */
  #errorThrown: boolean = false;

  constructor(service: StudioService) {
    this.#service = service;
  }

  /**
   * Handles an error event by reporting it and showing a dialog.
   *
   * @param scope - Human-readable scope of the failing component.
   * @param event - The captured error event.
   * @returns `true` if the handler considers the error handled.
   */
  processError(scope: string, event: Event): boolean {
    if ("reason" in event && event.reason instanceof Warning) {
      showInfoDialog({
        headline: "Warning",
        message: event.reason.message,
      }).then(EmptyExec);
      return false;
    }
    console.debug("processError", scope, event);
    if (this.#errorThrown) {
      return false;
    }
    this.#errorThrown = true;
    AnimationFrame.terminate();
    const error = ErrorInfo.extract(event);
    console.debug("ErrorInfo", error.name, error.message);
    const body = JSON.stringify({
      date: new Date().toISOString(),
      agent: Browser.userAgent,
      build: this.#service.buildInfo,
      scripts: document.scripts.length,
      error,
      logs: LogBuffer.get(),
    } satisfies ErrorLog);
    if (import.meta.env.PROD) {
      fetch("https://logs.opendaw.studio/log.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      }).then(console.info, console.warn);
    }
    console.error(scope, error.name, error.message, error.stack);
    const probablyHasExtension =
      document.scripts.length > 1 ||
      error.message?.includes("script-src blocked eval") === true ||
      error.stack?.includes("chrome-extension://") === true;
    if (Surface.isAvailable()) {
      showErrorDialog({
        scope: scope,
        name: error.name,
        message: error.message ?? "no message",
        probablyHasExtension,
        backupCommand: this.#service.recovery.createBackupCommand(),
      });
    } else {
      alert(`Boot Error in '${scope}': ${error.name}`);
    }
    return true;
  }

  /**
   * Installs global listeners on the given owner to catch uncaught errors.
   *
   * @param owner - Window or worker to attach listeners to.
   * @param scope - Descriptive name of the owner for reporting.
   * @returns Terminable that removes the listeners.
   */
  install(
    owner: WindowProxy | Worker | AudioWorkletNode,
    scope: string,
  ): Terminable {
    if (this.#errorThrown) {
      return Terminable.Empty;
    }
    const lifetime = this.terminator.own(new Terminator());
    lifetime.ownAll(
      Events.subscribe(owner, "error", (event) => {
        if (this.processError(scope, event)) {
          lifetime.terminate();
        }
      }),
      Events.subscribe(owner, "unhandledrejection", (event) => {
        if (this.processError(scope, event)) {
          lifetime.terminate();
        }
      }),
      Events.subscribe(owner, "messageerror", (event) => {
        if (this.processError(scope, event)) {
          lifetime.terminate();
        }
      }),
      Events.subscribe(owner, "processorerror" as any, (event) => {
        if (this.processError(scope, event)) {
          lifetime.terminate();
        }
      }),
      Events.subscribe(
        owner,
        "securitypolicyviolation",
        (event: SecurityPolicyViolationEvent) => {
          if (this.processError(scope, event)) {
            lifetime.terminate();
          }
        },
      ),
    );
    return lifetime;
  }
}

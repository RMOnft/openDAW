import { int } from "@opendaw/lib-std";
import { BuildInfo } from "@/BuildInfo.ts";
import { LogBuffer } from "@/errors/LogBuffer.ts";
import { ErrorInfo } from "@/errors/ErrorInfo.ts";

/** Payload sent when reporting runtime errors from the Studio. */
export type ErrorLog = {
  date: string;
  agent: string;
  build: BuildInfo;
  scripts: int;
  error: ErrorInfo;
  logs: Array<LogBuffer.Entry>;
};

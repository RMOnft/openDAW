/**
 * Metadata about the current build generated during the build step
 * (see `vite.config.ts`). The information is written to the public
 * folder and fetched at runtime to verify cache validity and expose
 * build details to the client.
 */
export type BuildInfo = {
  /** Unix timestamp of when the build was created. */
  date: number;
  /** Unique identifier used to bust caches between deployments. */
  uuid: string;
  /** Environment in which the build was produced. */
  env: "production" | "development";
};

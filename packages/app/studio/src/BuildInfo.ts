/**
 * Interface representing metadata about the current Studio build.
 * Generated during the Vite build step (see `vite.config.ts`) and
 * persisted to `public/build-info.json`. The data is fetched at
 * runtime to validate caches and expose build details to the client.
 *
 * Security note: the information exposed here contains no user data and
 * should not be used for authentication or authorization decisions.
 *
 * @public
 */
export type BuildInfo = {
  /** Unix timestamp of when the build was created. */
  date: number;
  /** Unique identifier used to bust caches between deployments. */
  uuid: string;
  /** Environment in which the build was produced. */
  env: "production" | "development";
};

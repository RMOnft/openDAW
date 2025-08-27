/**
 * Describes metadata emitted during the bundling process.
 *
 * `vite.config.ts` serializes this structure into `build.json` which is
 * served from the `public` directory. The Studio reads the file at runtime
 * to validate caches and display build information to the user.
 */
export type BuildInfo = {
  /** Unix timestamp of when the build was created. */
  date: number;
  /** Unique identifier used to bust caches between deployments. */
  uuid: string;
  /** Environment in which the build was produced. */
  env: "production" | "development";
};

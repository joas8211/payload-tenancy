import { Payload } from "payload";

declare global {
  /**
   * Payload instance. Available when test file ends with "admin.test.ts" or
   * "api.test.ts".
   */
  const payload: Payload;

  /**
   * URL to the running HTTP server, eg. "http://127.0.0.1:1234" (note that port
   * is not static).
   */
  const payloadUrl: string;

  /** Reset Payload by removing all existing documents. */
  const payloadReset: () => Promise<void>;
}

export {};

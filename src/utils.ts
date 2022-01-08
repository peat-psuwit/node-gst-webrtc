import { setImmediate } from 'timers';

/*
 * Yes, I know that setImmediate is not a standard, but since we're already using
 * Node's Buffer, we might as well assume Node's API.
 * Note: when we migrate to Node 16 we might want to migrate to promise version
 * of setImmediate in 'timers/promises'.
 */

export function resolveImmediate(): Promise<void> {
  return new Promise((resolve) => { setImmediate(resolve); });
}

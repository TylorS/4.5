import { Assertion, Verification } from '../types';

/**
 * Convert lazy assertions into eager assertions.
 * If an Assertion fails throws an Error.
 */
export function assert(assertion: Assertion<any>): void {
  const verification: Verification<any> =
    {
      success: Function.prototype as any,
      failure: (message: string) => { throw new Error(message); },
    };

  assertion.verify(verification);
}

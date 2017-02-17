import { Assertion, Verification } from '../types';

import { inspect } from '../helpers';

export function throws(f: () => any): Assertion<Error> {
  return new Throws(f);
}

class Throws implements Assertion<Error> {
  constructor(private f: () => any) {}

  public verify(verification: Verification<Error>) {
    const { f } = this;

    try {
      const x = f();
      verification.failure(`Did not throw, returned: ${inspect(x)}`);
    } catch (e) {
      verification.success(e);
    }
  }
}

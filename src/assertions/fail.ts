import { Assertion, Verification } from '../types';

import { inspect } from '../helpers';

export function fail(value: any): Assertion<any> {
  return new FailAssertion(value);
}

export class FailAssertion implements Assertion<any> {
  constructor(private value: any) {}

  public verify(verification: Verification<any>) {
    verification.failure(`Failed: ${inspect(this.value)}`);
  }
}

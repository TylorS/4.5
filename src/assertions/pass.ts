import { Assertion, Verification } from '../';

export function pass<T>(value: T): Assertion<T> {
  return new PassAssertion<T>(value);
}

export class PassAssertion<T> implements Assertion<T> {
  constructor(private value: T) {}

  public verify(verification: Verification<T>) {
    verification.success(this.value);
  }
}

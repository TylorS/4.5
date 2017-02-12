import { Assertion, Verification } from '../types';

import { curry } from '@typed/curry';

export const bimap: BimapFn = curry(
  function bimap<T, R>(
    failure: (message: string) => string,
    success: (value: T) => R,
    assertion: Assertion<T>): Assertion<R>
  {
    return new BimapAssertion<T, R>(failure, success, assertion);
  },
);

export interface BimapFn {
  <T, R>(
    failure: (message: string) => string,
    success: (value: T) => R,
    assertion: Assertion<T>): Assertion<R>;

  <T, R>(
    failure: (message: string) => string):
    (success: (value: T) => R,
    assertion: Assertion<T>) => Assertion<R>;

  <T, R>(
    failure: (message: string) => string,
    success: (value: T) => R):
    (assertion: Assertion<T>) => Assertion<R>;

  <T, R>(
    failure: (message: string) => string):
    (success: (value: T) => R) =>
    (assertion: Assertion<T>) => Assertion<R>;
}

class BimapAssertion<T, R> implements Assertion<R> {
  constructor(
    private failure: (message: string) => string,
    private success: (value: T) => R,
    private assertion: Assertion<T>) {}

  public verify(verification: Verification<R>) {
    const { failure, success, assertion } = this;

    assertion.verify({
      success(value: T) {
        verification.success(success(value));
      },
      failure(message: string) {
        verification.failure(failure(message));
      },
    });
  }
}

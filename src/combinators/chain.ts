import { Assertion, Verification } from '../types';

import { curry } from '@typed/curry';

export const chain: ChainFn = curry(function chain<T, R>(
  f: (value: T) => Assertion<R>,
  assertion: Assertion<T>): Assertion<R>
{
  return new ChainAssertion<T, R>(f, assertion);
});

export interface ChainFn {
  <T, R>(f: (value: T) => Assertion<R>, assertion: Assertion<T>): Assertion<R>;
  <T, R>(f: (value: T) => Assertion<R>): (assertion: Assertion<T>) => Assertion<R>;
}

class ChainAssertion<T, R> implements Assertion<R> {
  constructor(private f: (value: T) => Assertion<R>, private assertion: Assertion<T>) {}

  public verify(verification: Verification<R>) {
    const { f, assertion } = this;

    assertion.verify({
      success(value: T) {
        f(value).verify(verification);
      },
      failure(message: string) {
        verification.failure(message);
      },
    });
  }
}

import { Assertion, Verification } from '../types';
import { formatError, isEqual } from '../helpers';

import { curry } from '@typed/curry';

export const equals: EqualsFn =
  curry(<T>(expected: T, actual: T): Assertion<T> => new Equals<T>(expected, actual));

export interface EqualsFn {
  <T>(expected: T, actual: T): Assertion<T>;
  <T>(expected: T): (actual: T) => Assertion<T>;
}

export class Equals<T> implements Assertion<T> {
  constructor(private expected: T, private actual: T) {}

  public verify(verification: Verification<T>) {
    const { expected, actual } = this;

    if (isEqual(expected, actual))
      verification.success(actual);
    else
      verification.failure(formatError(`Not Equal`, expected, actual));
  }
}

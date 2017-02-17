import { Assertion, Verification } from '../types';

import { curry } from '@typed/curry';
import { formatError } from '../helpers';

export const is: IsFn =
  curry(<T>(expected: T, actual: T): Assertion<T> => new Is<T>(expected, actual));

export interface IsFn {
  <T>(expected: T, actual: T): Assertion<T>;
  <T>(expected: T): (actual: T) => Assertion<T>;
}

export class Is<T> implements Assertion<T> {
  constructor(private expected: T, private actual: T) {}

  public verify(verification: Verification<T>) {
    const { expected, actual } = this;

    if (expected === actual)
      verification.success(actual);
    else
      verification.failure(formatError(`Not Same Reference`, expected, actual));
  }
}

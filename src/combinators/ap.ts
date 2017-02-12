import { Assertion } from '../types';
import { chain } from './chain';
import { curry } from '@typed/curry';
import { map } from './map';

export const ap: ApFn = curry(function ap<T, R>(
  fnAssertion: Assertion<(value: T) => R>,
  valueAssertion: Assertion<T>): Assertion<R>
{
  return chain(f => map(f, valueAssertion), fnAssertion);
});

export interface ApFn {
  <T, R>(fnAssertion: Assertion<(value: T) => R>, valueAssertion: Assertion<T>): Assertion<R>;
  <T, R>(fnAssertion: Assertion<(value: T) => R>): (valueAssertion: Assertion<T>) => Assertion<R>;
}

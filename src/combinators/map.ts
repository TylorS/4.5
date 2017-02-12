import { Assertion } from '../types';
import { chain } from './chain';
import { curry } from '@typed/curry';
import { pass } from '../assertions';

export const map: MapFn = curry(
  function map<T, R>(f: (value: T) => R, assertion: Assertion<T>): Assertion<R> {
    return chain<T, R>((x: T) => pass<R>(f(x)), assertion);
  },
);

export interface MapFn {
  <T, R>(f: (value: T) => R, assertion: Assertion<T>): Assertion<R>;
  <T, R>(f: (value: T) => R): (assertion: Assertion<T>) => Assertion<R>;
}

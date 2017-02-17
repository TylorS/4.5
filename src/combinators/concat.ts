import { Assertion } from '../types';
import { chain } from './chain';
import { curry } from '@typed/curry';

export const concat: ConcatFn = curry(
  function concat<A>(assertion1: Assertion<A>, assertion2: Assertion<A>) {
    return chain(() => assertion2, assertion1);
  },
);

export interface ConcatFn {
  <A>(assertion1: Assertion<A>, assertion2: Assertion<A>): Assertion<A>;
  <A>(assertion1: Assertion<A>): (assertion2: Assertion<A>) => Assertion<A>;
}

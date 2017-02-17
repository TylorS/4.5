import { bold, green, red } from 'typed-colors';

import { inspect } from './object-inspect';

export function formatError(message: string, expected: any, actual: any): string {
  return `${bold(message)}
${green('expected')}: ${inspect(expected)}
  ${red('actual')}: ${inspect(actual)}`;
}

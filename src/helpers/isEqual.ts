import { functionName } from './functionName';
import { type } from './type';

// slightly modified version of ramda's R.equals
export function isEqual(a: any, b: any): boolean {
  return _isEqual(a, b, [], []);
}

function _isEqual(a: any, b: any, stackA: Array<any>, stackB: Array<any>): boolean {
  if (a === b)
    return true;

  if (type(a) !== type(b))
    return false;

  // tslint:disable-next-line
  if (a == null || b == null)
    return false;

  if (typeof a.equals === 'function' || typeof b.equals === 'function')
    return typeof a.equals === 'function' && a.equals(b) &&
      typeof b.equals === 'function' && b.equals(a);

  switch (type(a)) {
    case 'Arguments':
    case 'Array':
    case 'Object':
      if (typeof a.constructor === 'function' &&
        functionName(a.constructor) === 'Promise')
        return a === b;
      break;
    case 'Boolean':
    case 'Number':
    case 'String':
      if (!(typeof a === typeof b && a.valueOf() === b.valueOf()))
        return false;
      break;
    case 'Date':
      if (a.valueOf() !== b.valueOf())
        return false;

      break;
    case 'Error':
      return a.name === b.name && a.message === b.message;
    case 'RegExp':
      if (!(a.source === b.source &&
        a.global === b.global &&
        a.ignoreCase === b.ignoreCase &&
        a.multiline === b.multiline &&
        a.sticky === b.sticky &&
        a.unicode === b.unicode))
      {
        return false;
      }
      break;
    case 'Map':
    case 'Set':
      if (!_isEqual(Array.from(a.entries()), Array.from(b.entries()), stackA, stackB))
        return false;
      break;
    case 'Int8Array':
    case 'Uint8Array':
    case 'Uint8ClampedArray':
    case 'Int16Array':
    case 'Uint16Array':
    case 'Int32Array':
    case 'Uint32Array':
    case 'Float32Array':
    case 'Float64Array':
      break;
    case 'ArrayBuffer':
      break;
    default:
      // Values of other types are only equal if identical.
      return false;
  }

  const keysA = Object.keys(a);

  if (keysA.length !== Object.keys(b).length)
    return false;

  let idx = stackA.length - 1;

  while (idx >= 0) {
    if (stackA[idx] === a)
      return stackB[idx] === b;

    idx -= 1;
  }

  stackA.push(a);
  stackB.push(b);
  idx = keysA.length - 1;

  while (idx >= 0) {
    const key = keysA[idx];

    if (!(b[key] && _isEqual(b[key], a[key], stackA, stackB)))
      return false;

    idx -= 1;
  }

  stackA.pop();
  stackB.pop();

  return true;
};

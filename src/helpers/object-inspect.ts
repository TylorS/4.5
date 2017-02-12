// extracted and slightly modified from object-inspect
import { functionName } from './functionName';

const hasMap = typeof Map === 'function' && Map.prototype;

const mapSizeDescriptor =
  Object.getOwnPropertyDescriptor && hasMap
    ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;

const mapSize = hasMap && mapSizeDescriptor &&
  typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null ||
  Function.prototype;

const mapForEach = hasMap && Map.prototype.forEach || Function.prototype;

const hasSet = typeof Set === 'function' && Set.prototype || Function.prototype;

const setSizeDescriptor = Object.getOwnPropertyDescriptor &&
  hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;

const setSize = hasSet && setSizeDescriptor &&
  typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null ||
  Function.prototype;

const setForEach = hasSet && Set.prototype.forEach || Function.prototype;
const booleanValueOf = Boolean.prototype.valueOf;
const objectToString = Object.prototype.toString;

export function inspect(obj: any, seen: Array<any> = []): string {
  if (typeof obj === 'undefined')
    return 'undefined';

  if (obj === null)
    return 'null';

  if (typeof obj === 'boolean')
    return obj ? 'true' : 'false';

  if (typeof obj === 'string')
    return inspectString(obj);

  if (typeof obj === 'number') {
    if (obj === 0)
      return Infinity / obj > 0 ? '0' : '-0';

    return String(obj);
  }

  if (indexOf(seen, obj) >= 0) {
    return '[Circular]';
  }

  function internalInspect(value: any, from?: any) {
    if (from) {
      seen = seen.slice();
      seen.push(from);
    }
    return inspect(value, seen);
  }

  if (typeof obj === 'function') {
    const name = functionName(obj);
    return '[Function' + (name ? ': ' + name : '') + ']';
  }

  if (isSymbol(obj)) {
    const symString = Symbol.prototype.toString.call(obj);
    return typeof obj === 'object' ? markBoxed(symString) : symString;
  }

  if (isElement(obj)) {
    let s = '<' + String(obj.nodeName).toLowerCase();
    const attrs = obj.attributes || [];

    for (let i = 0; i < attrs.length; i++)
      s += ' ' + attrs[i].name + '="' + quote(attrs[i].value) + '"';

    s += '>';

    if (obj.childNodes && obj.childNodes.length) s += '...';

    s += '</' + String(obj.nodeName).toLowerCase() + '>';

    return s;
  }

  if (isArray(obj)) {
    if (obj.length === 0) return '[]';

    const xs = Array(obj.length);

    for (let i = 0; i < obj.length; i++)
      xs[i] = has(obj, i) ? internalInspect(obj[i], obj) : '';

    return '[ ' + xs.join(', ') + ' ]';
  }

  if (isError(obj)) {
    const parts = [];

    for (const key in obj) {
      if (!has(obj, key)) continue;

      if (/[^\w$]/.test(key)) {
        parts.push(internalInspect(key) + ': ' + internalInspect(obj[key]));
      } else {
        parts.push(key + ': ' + internalInspect(obj[key]));
      }
    }

    if (parts.length === 0) return '[' + String(obj) + ']';

    return '{ [' + String(obj) + '] ' + parts.join(', ') + ' }';
  }

  if (typeof obj === 'object' && typeof obj.inspect === 'function')
    return obj.inspect();

  if (isMap(obj)) {
    const parts: Array<any> = [];

    mapForEach.call(obj, function (value: any, key: string) {
      parts.push(internalInspect(key, obj) + ' => ' + internalInspect(value, obj));
    });

    return collectionOf('Map', mapSize.call(obj), parts);
  }

  if (isSet(obj)) {
    const parts: Array<any> = [];

    setForEach.call(obj, function (value: any) {
      parts.push(internalInspect(value, obj));
    });

    return collectionOf('Set', setSize.call(obj), parts);
  }

  if (isNumber(obj))
    return markBoxed(Number(obj));

  if (isBoolean(obj))
    return markBoxed(booleanValueOf.call(obj));

  if (isString(obj))
    return markBoxed(internalInspect(String(obj)));

  if (!isDate(obj) && !isRegExp(obj)) {
    const xs = [];
    const keys = objectKeys(obj).sort();

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (/[^\w$]/.test(key)) {
        xs.push(internalInspect(key) + ': ' + internalInspect(obj[key], obj));
      }
      else xs.push(key + ': ' + internalInspect(obj[key], obj));
    }

    if (xs.length === 0) return '{}';

    return '{ ' + xs.join(', ') + ' }';
  }

  return String(obj);
};

function objectKeys(obj: any) {
  const keys = [];

  for (const key in obj) {
    if (has(obj, key)) keys.push(key);
  }

  return keys;
}

function quote(s: string) {
  return String(s).replace(/"/g, '&quot;');
}

function isArray(obj: any) { return toStr(obj) === '[object Array]'; }
function isDate(obj: any) { return toStr(obj) === '[object Date]'; }
function isRegExp(obj: any) { return toStr(obj) === '[object RegExp]'; }
function isError(obj: any) { return toStr(obj) === '[object Error]'; }
function isSymbol(obj: any) { return toStr(obj) === '[object Symbol]'; }
function isString(obj: any) { return toStr(obj) === '[object String]'; }
function isNumber(obj: any) { return toStr(obj) === '[object Number]'; }
function isBoolean(obj: any) { return toStr(obj) === '[object Boolean]'; }

const hasOwn = Object.prototype.hasOwnProperty || function (key: string) { return key in this; };
function has(obj: any, key: string | number) {
  return hasOwn.call(obj, key);
}

function toStr(obj: any) {
  return objectToString.call(obj);
}

function indexOf(xs: any, x: any) {
  if (xs.indexOf) return xs.indexOf(x);

  for (let i = 0, l = xs.length; i < l; i++)
    if (xs[i] === x) return i;

  return -1;
}

function isMap(x: any) {
  if (!mapSize)
    return false;

  try {
    mapSize.call(x);
    return true;
  } catch (e) { }

  return false;
}

function isSet(x: any) {
  if (!setSize)
    return false;

  try {
    setSize.call(x);
    return true;
  } catch (e) { }

  return false;
}

function isElement(x: any) {
  if (!x || typeof x !== 'object') return false;

  if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement)
    return true;

  return typeof x.nodeName === 'string'
    && typeof x.getAttribute === 'function';
}

function inspectString(str: string) {
  return "'" + str.replace(/(['\\])/g, '\\$1').replace(/[\x00-\x1f]/g, lowbyte) + "'";
}

function lowbyte(c: string) {
  const n = c.charCodeAt(0);
  const x = ({ 8: 'b', 9: 't', 10: 'n', 12: 'f', 13: 'r' } as any)[n];

  if (x) return '\\' + x;

  return '\\x' + (n < 0x10 ? '0' : '') + n.toString(16);
}

function markBoxed(str: string | number) {
  return 'Object(' + str + ')';
}

function collectionOf(type: string, size: string, entries: Array<string>) {
  return type + ' (' + size + ') {' + entries.join(', ') + '}';
}

export function type(value: any): string {
  return value === null ? 'Null' :
    value === void 0 ? 'Undefined' :
    Object.prototype.toString.call(value).slice(8, -1);
}

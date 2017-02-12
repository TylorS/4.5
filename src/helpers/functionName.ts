export function functionName(f: any) {
  if (f.name) return f.name;

  const m = String(f).match(/^function\s*([\w$]+)/);

  if (m) return m[1];
}

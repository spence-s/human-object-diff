export default function isObject(x: unknown) {
  return typeof x === 'object' && x !== null;
}

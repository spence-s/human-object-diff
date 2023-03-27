import { type Diff } from 'deep-diff';

export function isArrayDiff(diff: Diff<unknown, unknown>): boolean {
  const isArray =
    diff.kind === 'A' ||
    (diff.path && typeof diff.path[diff.path.length - 1] === 'number');
  return Boolean(isArray);
}

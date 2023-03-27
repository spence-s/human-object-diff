import type deepDiff from 'deep-diff';
import { isArrayDiff } from './is-array';

export function appendDotPath(diff: deepDiff.Diff<unknown, unknown>): string {
  if (!diff.path) {
    return '';
  }

  if (!isArrayDiff(diff)) {
    return diff.path.reduce(dotPathReducer({ path: diff.path }), '');
  }

  let propertyIndex = diff.path.length - 1;
  while (typeof diff.path[propertyIndex] !== 'string') {
    propertyIndex -= 1;
  }

  return diff.path
    .slice(0, propertyIndex + 1)
    .reduce(dotPathReducer({ path: diff.path }), '');
}

export function dotPathReducer(diff: {
  path: any[] | undefined | string[] | unknown[];
}) {
  return function (acc: string, value: unknown, i: number): string {
    return typeof value === 'string'
      ? diff.path && typeof diff.path[i + 1] === 'string'
        ? acc.concat(`${String(value)}.`)
        : acc.concat(String(value))
      : diff.path && typeof diff.path[i + 1] === 'string'
      ? acc.concat(`[${String(value)}].`)
      : acc.concat(`[${String(value)}]`);
  };
}

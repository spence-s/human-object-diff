import type deepDiff from 'deep-diff';
import { appendDotPath } from './utils/append-dot-path';
import isObject from './utils/is-object';
import { isArrayDiff as isArray } from './utils/is-array';

export default class Diff {
  public readonly isArray: boolean;
  public readonly lhs: unknown;
  public readonly rhs: unknown;
  public index: number | undefined;
  public readonly path: unknown[] | undefined;
  public val: unknown;
  public readonly dotPath: string;
  readonly kind: 'N' | 'D' | 'A' | 'E';
  private readonly item: deepDiff.Diff<unknown, unknown> | undefined;
  private readonly hasNestedChanges: boolean;

  constructor(diff: deepDiff.Diff<unknown, unknown>) {
    this.kind = diff.kind;
    if (diff.kind !== 'E' && diff.kind !== 'D' && diff.kind !== 'N') {
      this.index = diff.index;
    }

    if (diff.kind !== 'A' && diff.kind !== 'N') {
      this.lhs = diff.lhs;
    }

    if (diff.kind !== 'A' && diff.kind !== 'D') {
      this.rhs = diff.rhs;
    }

    if (diff.kind !== 'E' && diff.kind !== 'D' && diff.kind !== 'N') {
      this.item = diff.item;
    }

    this.path = diff.path;
    this.isArray = isArray(diff);
    this.hasNestedChanges =
      diff.kind !== 'E' &&
      diff.kind !== 'D' &&
      diff.kind !== 'N' &&
      isObject(diff.item);

    this.dotPath = appendDotPath(diff);
  }
}

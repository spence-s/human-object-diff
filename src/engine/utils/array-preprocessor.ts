import equal from 'fast-deep-equal';
import type Diff from '../../diff';
import { type DiffConfig } from '../../types';

export type Change =
  | {
      path: string[];
      dotPath: string;
      kind: 'I' | 'R';
      index: number;
      val: unknown;
    }
  | {
      path: string[];
      dotPath: string;
      kind: keyof DiffConfig['templates'];
      isArray: boolean;
      lhs: unknown;
      rhs: unknown;
      index: number | undefined;
      val: unknown;
    };

export default function preProcessArray(
  diffs: Diff[] = [],
  lhs: unknown = [],
  rhs: unknown = []
): Array<string | Change> {
  const groupedDiffs = groupDiffsByPath(diffs);

  let diffStrings: Array<string | Change> = [];

  for (const path in groupedDiffs) {
    if (Object.prototype.hasOwnProperty.call(groupedDiffs, path)) {
      let lhsValue = lhs;
      let rhsValue = rhs;

      for (const p of path.split(/[.[]]/gi).filter(Boolean)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        lhsValue = lhsValue[p];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        rhsValue = rhsValue[p];
      }

      const groupedDiff = groupedDiffs[path];

      const { insertions, cutoff } = getInsertions(lhsValue, rhsValue);

      const changes = [
        ...insertions,
        ...groupedDiff
          .filter((diff) => Number(diff.index) < cutoff && diff.kind === 'E')
          .map(
            (diff: Diff): Change => ({
              ...diff,
              dotPath: path,
              kind: 'AE',
              path: path.split(/[.[]]/gi).filter(Boolean)
            })
          )
      ].map((diff) => ({
        ...diff,
        path: path.split(/[.[]]/gi).filter(Boolean),
        dotPath: path
      }));
      diffStrings = [...diffStrings, ...changes];
    }
  }

  return diffStrings;
}

function groupDiffsByPath(diffs: Diff[]): Record<string, Diff[]> {
  const diffGroups: Record<string, Diff[]> = {};

  for (const diff of diffs) {
    diff.index =
      diff.index ??
      (Array.isArray(diff.path) ? Number(diff.path[diff.path.length - 1]) : 0);
    if (diffGroups[diff.dotPath] && Array.isArray(diffGroups[diff.dotPath])) {
      diffGroups[diff.dotPath].push(diff);
    } else {
      diffGroups[diff.dotPath] = [diff];
    }
  }

  return diffGroups;
}

function getInsertions(
  lhs: unknown = [],
  rhs: unknown = []
): {
  insertions: Array<{
    kind: 'I' | 'R';
    index: number;
    val: unknown;
  }>;
  cutoff: number;
} {
  if (!Array.isArray(lhs) || !Array.isArray(rhs)) {
    return {
      cutoff: 0,
      insertions: []
    };
  }

  const insertionCount = rhs.length - lhs.length;
  const kind: 'I' | 'R' =
    insertionCount !== 0 && insertionCount > 0 ? 'I' : 'R';
  const longer = kind === 'I' ? Array.from(rhs) : Array.from(lhs);
  const shorter = kind === 'I' ? Array.from(lhs) : Array.from(rhs);
  const longerLength = longer.length;
  const insertions = [];

  let absCount = Math.abs(insertionCount);
  let negIndex = 0;

  while (absCount !== 0) {
    negIndex -= 1;
    if (
      equal(longer[longer.length - 1], shorter[longer.length - 1 - absCount])
    ) {
      longer.pop();
      shorter.pop();
    } else {
      const value = longer.pop() as unknown;
      const index = longerLength - Math.abs(negIndex);
      insertions.push({
        kind,
        index,
        val: value
      });
      absCount -= 1;
    }
  }

  return {
    insertions,
    cutoff: Math.min(...insertions.map((ins) => ins.index))
  };
}

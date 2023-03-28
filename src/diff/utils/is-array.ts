import { type Diff } from 'deep-diff'

export function isArrayDiff(diff: Diff<unknown, unknown>): boolean {
  const isArray = diff.kind === 'A' || diff.path?.map((p) => typeof p).includes('number')
  return Boolean(isArray)
}

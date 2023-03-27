import { DiffEngine } from '../src';
import { preProcessArrayDiffs } from '../src/engine/utils/array-preprocessor';
import Diff from '../src/diff';

describe('empty array', () => {
  const { diff } = new DiffEngine();

  const lhs = {
    name: 'lhs',
    flags: []
  };
  const rhs = {
    name: 'rhs',
    flags: [1]
  };

  it('without nesting', () => {
    expect(diff(lhs, rhs)).toEqual([
      '"Name", with a value of "lhs" (at Obj.name) was changed to "rhs"',
      'Array "Flags" (at Obj.flags), had a value of "1" inserted at index 0'
    ]);
  });
  it('with nesting', () => {
    expect(diff({ nested: lhs }, { nested: rhs })).toEqual([
      '"Name", with a value of "lhs" (at Obj.nested.name) was changed to "rhs"',
      'Array "Flags" (at Obj.nested.flags), had a value of "1" inserted at index 0'
    ]);
  });

  it('preProcessArrayDiffs without nesting', () => {
    const df = preProcessArrayDiffs(
      [
        new Diff({
          kind: 'A',
          index: 0,
          item: { kind: 'N', rhs: 1 },
          path: ['flags']
        })
      ],
      lhs,
      rhs
    );
    expect(df).toEqual([
      {
        kind: 'I',
        index: 0,
        val: 1,
        path: ['flags'],
        dotPath: 'flags'
      }
    ]);
  });

  it('preProcessArrayDiffs with nesting', () => {
    const df = preProcessArrayDiffs(
      [
        new Diff({
          kind: 'A',
          index: 0,
          item: { kind: 'N', rhs: 1 },
          path: ['nested', 'flags']
        })
      ],
      { nested: lhs },
      { nested: rhs }
    );
    expect(df).toEqual([
      {
        kind: 'I',
        index: 0,
        val: 1,
        path: ['nested', 'flags'],
        dotPath: 'nested.flags'
      }
    ]);
  });
});

import { splitPath } from '../src/engine/utils/array-preprocessor';

describe('split path', () => {
  it('basic', () => {
    expect(splitPath('a')).toEqual(['a']);
  });
  it('for object', () => {
    expect(splitPath('a.b')).toEqual(['a', 'b']);
  });
  it('for array', () => {
    expect(splitPath('a[2]')).toEqual(['a', '2']);
  });
});

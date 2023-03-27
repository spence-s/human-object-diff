import * as HR from '../src/index'
import { isPathMathToPattern } from '../src/sentence'

describe('sensitive-paths', () => {
  test('Uses custom templates successfully', () => {
    const sensitivePaths = ['foo', 'bar', 'biz', 'arr', 'arr2', 'arr3']
    const hr = new HR({ sensitivePaths }).diff

    const lhs = {
      foo: 'bar',
      biz: 'baz',
      arr: [1, 2, 3],
      arr2: [1, 2, 3, 4],
      arr3: [1, 2, 3, 4],
    }
    const rhs = {
      bar: 'foo',
      biz: 'buz',
      arr: [1, 2, 5, 3],
      arr2: [1, 2, 4],
      arr3: [1, 2, 4, 4],
    }

    expect(hr(lhs, rhs)).toEqual([
      '"Foo" (at Obj.foo) was removed',
      '"Biz" (at Obj.biz) was changed',
      '"Bar" (at Obj.bar) was added',
      'Array "Arr" (at Obj.arr), had a value inserted at index 2',
      'Array "Arr2" (at Obj.arr2), had a value removed at index 2',
      'Array "Arr3" (at Obj.arr3), had a value changed at index 2',
    ])
  })

  test('I can use sensitive in an array', () => {
    const lhs = {
      foo: [{ bar: 1 }],
    }
    const rhs = {
      foo: [{ bar: 2 }],
    }

    expect(new HR().diff(lhs, rhs)).toEqual(['"Bar", with a value of "1" (at Obj.foo[0].bar) was changed to "2"'])
    expect(new HR({ sensitivePaths: ['foo[].bar'] }).diff(lhs, rhs)).toEqual(['"Bar" (at Obj.foo[0].bar) was changed'])
  })

  test('is-path-math-to-pattern for direct matching', () => {
    expect(isPathMathToPattern('k', ['k'])).toBeTruthy()
  })

  test('is-path-math-to-pattern for array', () => {
    expect(isPathMathToPattern('[0]', ['[]'])).toBeTruthy()
  })

  test('is-path-math-to-pattern for key[]', () => {
    expect(isPathMathToPattern('key[0]', ['key[]'])).toBeTruthy()
  })

  test('is-path-math-to-pattern for key[]sub', () => {
    expect(isPathMathToPattern('key[0]sub', ['key[]sub'])).toBeTruthy()
  })

  test('is-path-math-to-pattern for [][]', () => {
    expect(isPathMathToPattern('[0][1]', ['[][]'])).toBeTruthy()
  })

  test('is-path-math-to-pattern for direct index matching', () => {
    expect(isPathMathToPattern('[0]', ['[0]'])).toBeTruthy()
  })
})

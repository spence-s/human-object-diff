import HR from '../src/index'
import { isArrayDiff } from '../src/diff/utils/is-array'

describe('array of objects', () => {
  const hr = new HR().diff

  it('array of primitives', () => {
    const lhs = {
      items: [1, 3],
    }

    const rhs = {
      items: [1, 2, 3],
    }

    expect(hr(lhs, rhs)).toEqual(['Array "Items" (at Obj.items), had a value of "2" inserted at index 1'])
  })

  it('array of objects', () => {
    const lhs = {
      items: [{ key: 1 }, { key: 3 }],
    }

    const rhs = {
      items: [{ key: 1 }, { key: 2 }, { key: 3 }],
    }

    expect(hr(lhs, rhs)).toEqual(['Array "Items" (at Obj.items), had a value of "{key:2}" inserted at index 1'])

    expect(isArrayDiff({ kind: 'E', path: ['items', 1, 'key'], lhs: 3, rhs: 2 })).toBeTruthy()
  })
})

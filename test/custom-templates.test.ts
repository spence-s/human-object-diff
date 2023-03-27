import HR from '../src/index'

describe('custom-templates', () => {
  let hr: Function

  beforeEach(() => {
    const templates = {
      N: 'testing "FIELD" "NEWVALUE" DOTPATH added',
      D: 'testing "FIELD" "OLDVALUE" DOTPATH removed',
      E: 'testing "FIELD" "OLDVALUE" (DOTPATH) "NEWVALUE" edit',
      I: 'testing Arr "FIELD" (DOTPATH), "NEWVALUE" inserted at INDEX',
      R: 'testing Arr "FIELD" (DOTPATH), "OLDVALUE" removed at INDEX',
      AE: 'testing Arr "FIELD" (DOTPATH), "OLDVALUE" "NEWVALUE" changed at INDEX',
    }
    hr = new HR({ templates }).diff
  })

  it('humanReadable is a function', () => {
    expect(typeof hr === 'function').toBeTruthy()
  })

  it('Uses custom templates successfully', () => {
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
      'testing "Foo" "bar" Obj.foo removed',
      'testing "Biz" "baz" (Obj.biz) "buz" edit',
      'testing "Bar" "foo" Obj.bar added',
      'testing Arr "Arr" (Obj.arr), "5" inserted at 2',
      'testing Arr "Arr2" (Obj.arr2), "3" removed at 2',
      'testing Arr "Arr3" (Obj.arr3), "3" "4" changed at 2',
    ])
  })
})

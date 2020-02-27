const test = require('ava');
const HR = require('..');

test.beforeEach(t => {
  const templates = {
    N: 'testing "FIELD" "NEWVALUE" DOTPATH added',
    D: 'testing "FIELD" "OLDVALUE" DOTPATH removed',
    E: 'testing "FIELD" "OLDVALUE" (DOTPATH) "NEWVALUE" edit',
    I: 'testing Arr "FIELD" (DOTPATH), "NEWVALUE" inserted at INDEX',
    R: 'testing Arr "FIELD" (DOTPATH), "OLDVALUE" removed at INDEX',
    AE: 'testing Arr "FIELD" (DOTPATH), "OLDVALUE" "NEWVALUE" changed at INDEX'
  };
  t.context.hr = new HR({ templates }).diff;
});

test('humanReadable is a function', t => {
  t.true(typeof t.context.hr === 'function');
});

test('Uses custom templates successfully', t => {
  const lhs = {
    foo: 'bar',
    biz: 'baz',
    arr: [1, 2, 3],
    arr2: [1, 2, 3, 4],
    arr3: [1, 2, 3, 4]
  };
  const rhs = {
    bar: 'foo',
    biz: 'buz',
    arr: [1, 2, 5, 3],
    arr2: [1, 2, 4],
    arr3: [1, 2, 4, 4]
  };

  t.deepEqual(t.context.hr(lhs, rhs), [
    'testing "Foo" "bar" Obj.foo removed',
    'testing "Biz" "baz" (Obj.biz) "buz" edit',
    'testing "Bar" "foo" Obj.bar added',
    'testing Arr "Arr" (Obj.arr), "5" inserted at 2',
    'testing Arr "Arr2" (Obj.arr2), "3" removed at 2',
    'testing Arr "Arr3" (Obj.arr3), "3" "4" changed at 2'
  ]);
});

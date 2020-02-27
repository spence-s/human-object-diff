const test = require('ava');
const HR = require('..');

test.beforeEach(t => {
  const sensitivePaths = ['foo', 'bar', 'biz', 'arr', 'arr2', 'arr3'];
  t.context.hr = new HR({ sensitivePaths }).diff;
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
    '"Foo" (at Obj.foo) was removed',
    '"Biz" (at Obj.biz) was changed',
    '"Bar" (at Obj.bar) was added',
    'Array "Arr" (at Obj.arr), had a value inserted at index 2',
    'Array "Arr2" (at Obj.arr2), had a value removed at index 2',
    'Array "Arr3" (at Obj.arr3), had a value changed at index 2'
  ]);
});

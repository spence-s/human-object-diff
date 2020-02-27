const test = require('ava');
const HR = require('..');

test.beforeEach(t => {
  t.context.hr = config => new HR(config).diff;
});

test('humanReadable is a function', t => {
  t.true(typeof t.context.hr === 'function');
});

test('prefilters with an array of values', t => {
  const lhs = {
    foo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    bar: 'hello',
    baz: 12,
    chip: 'dale',
    biz: { baz: [1, 2, { hello: ['then'] }, 4, 5] },
    base: [1, 2, 3, 4, 5]
  };
  const rhs = {
    foo: [1, 2, 3, 4, 5, 5, 7, 8, 9, 10, 11],
    bar: 'hello world',
    baz: 10,
    biz: { baz: [1, 2, { hello: ['there', 'was'] }, 5] },
    base: [1, 2, 2, 5]
  };

  t.deepEqual(t.context.hr({ prefilter: ['baz', 'foo'] })(lhs, rhs), [
    '"Bar", with a value of "hello" (at Obj.bar) was changed to "hello world"',
    '"Chip", with a value of "dale" (at Obj.chip) was removed',
    'Array "Baz" (at Obj.biz.baz), had a value of "4" removed at index 3',
    'Array "Hello" (at Obj.biz.baz[2].hello), had a value of "was" inserted at index 1',
    'Array "Hello" (at Obj.biz.baz[2].hello), had a value of "then" changed to "there" at index 0',
    'Array "Base" (at Obj.base), had a value of "4" removed at index 3',
    'Array "Base" (at Obj.base), had a value of "3" changed to "2" at index 2'
  ]);
});

test('prefilters with a function', t => {
  const lhs = {
    foo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    bar: 'hello',
    baz: 12,
    chip: 'dale',
    biz: { baz: [1, 2, { hello: ['then'] }, 4, 5] },
    base: [1, 2, 3, 4, 5]
  };
  const rhs = {
    foo: [1, 2, 3, 4, 5, 5, 7, 8, 9, 10, 11],
    bar: 'hello world',
    baz: 10,
    biz: { baz: [1, 2, { hello: ['there', 'was'] }, 5] },
    base: [1, 2, 2, 5]
  };

  t.deepEqual(t.context.hr({ prefilter: (path, key) => key === 2 })(lhs, rhs), [
    '"Bar", with a value of "hello" (at Obj.bar) was changed to "hello world"',
    '"Baz", with a value of "12" (at Obj.baz) was changed to "10"',
    '"Chip", with a value of "dale" (at Obj.chip) was removed',
    'Array "Foo" (at Obj.foo), had a value of "11" inserted at index 10',
    'Array "Foo" (at Obj.foo), had a value of "6" changed to "5" at index 5',
    'Array "Baz" (at Obj.biz.baz), had a value of "4" removed at index 3',
    'Array "Base" (at Obj.base), had a value of "4" removed at index 3'
  ]);
});

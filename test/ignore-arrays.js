const test = require('ava');
const HR = require('..');

test.beforeEach(t => {
  t.context.hr = new HR({ ignoreArrays: true }).diff;
});

test('humanReadable is a function', t => {
  t.true(typeof t.context.hr === 'function');
});

test('ignores arrays', t => {
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

  t.deepEqual(t.context.hr(lhs, rhs), [
    '"Bar", with a value of "hello" (at Obj.bar) was changed to "hello world"',
    '"Baz", with a value of "12" (at Obj.baz) was changed to "10"',
    '"Chip", with a value of "dale" (at Obj.chip) was removed'
  ]);
});

const test = require('ava');
const HR = require('..');

test.beforeEach(t => {
  t.context.hr = new HR().diff;
});

test('humanReadable is a function', t => {
  t.true(typeof t.context.hr === 'function');
});

test('Describes an object new key addition', t => {
  const lhs = {};
  const rhs = {
    bar: 'hello world'
  };

  t.deepEqual(t.context.hr(lhs, rhs), [
    '"Bar", with a value of "hello world" (at Obj.bar) was added'
  ]);
});

test('Describes an object key removal', t => {
  const lhs = {
    bar: 'hello world'
  };
  const rhs = {};

  t.deepEqual(t.context.hr(lhs, rhs), [
    '"Bar", with a value of "hello world" (at Obj.bar) was removed'
  ]);
});

test('Describes an object key edit', t => {
  const lhs = { foo: 'hello' };
  const rhs = {
    foo: 'hello world'
  };

  t.deepEqual(t.context.hr(lhs, rhs), [
    '"Foo", with a value of "hello" (at Obj.foo) was changed to "hello world"'
  ]);
});

test('Describes an array insertion', t => {
  const lhs = { foo: [1, 2, 3, 4, 5, 6] };
  const rhs = {
    foo: [1, 2, 3, 8, 4, 5, 6]
  };

  t.deepEqual(t.context.hr(lhs, rhs), [
    'Array "Foo" (at Obj.foo), had a value of "8" inserted at index 3'
  ]);
});

test('Describes an array removal', t => {
  const lhs = { foo: [1, 2, 3, 4, 5, 6] };
  const rhs = {
    foo: [1, 2, 4, 5, 6]
  };

  t.deepEqual(t.context.hr(lhs, rhs), [
    'Array "Foo" (at Obj.foo), had a value of "3" removed at index 2'
  ]);
});

test('Describes an array edit', t => {
  const lhs = { foo: [1, 2, 3, 4, 5, 6] };
  const rhs = {
    foo: [1, 2, 8, 4, 5, 6]
  };

  t.deepEqual(t.context.hr(lhs, rhs), [
    'Array "Foo" (at Obj.foo), had a value of "3" changed to "8" at index 2'
  ]);
});

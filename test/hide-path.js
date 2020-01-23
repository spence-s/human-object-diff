const test = require('ava');

const hr = require('..');

test.beforeEach(t => {
  const objectName = 'rhs';
  const options = { objectName, hidePath: true };
  t.context.hr = (lhs, rhs) => hr(lhs, rhs, options);
});

test('humanReadable is a function', t => {
  t.true(typeof t.context.hr === 'function');
});

test('remove base property', t => {
  const lhs = { foo: 'bar' };
  const rhs = {};
  t.is(t.context.hr(lhs, rhs)[0], '"Foo", with a value of "bar" was removed');
});

test('add base property', t => {
  const lhs = {};
  const rhs = { foo: 'bar' };
  t.is(t.context.hr(lhs, rhs)[0], '"Foo", with a value of "bar" was added');
});

test('add nested property', t => {
  const lhs = { foo: {} };
  const rhs = { foo: { bar: 'baz' } };

  t.is(t.context.hr(lhs, rhs)[0], '"Bar", with a value of "baz" was added');
});

test('add base object property', t => {
  const lhs = {};
  const rhs = { foo: { bar: 'baz' } };

  const string = '"Foo", with a value of {"bar":"baz"} was added';

  t.is(t.context.hr(lhs, rhs)[0], string);
});

test('add base array property', t => {
  const lhs = {};
  const rhs = { foo: ['bar', 'baz'] };

  const string = '"Foo", with a value of ["bar","baz"] was added';

  t.is(t.context.hr(lhs, rhs)[0], string);
});

test('Shows a base property change', t => {
  const lhs = { foo: 'blurp' };
  const rhs = { foo: 'blam' };

  const string = '"Foo", with a value of "blurp" was changed to "blam"';

  t.is(t.context.hr(lhs, rhs)[0], string);
});

test('Shows a date change correctly', t => {
  const lhs = { foo: new Date(2019, 11, 22, 17) };
  const rhs = { foo: new Date(2019, 11, 25, 9) };

  const string =
    '"Foo", with a value of "12/22/2019 05:00 PM" was changed to "12/25/2019 09:00 AM"';

  t.is(t.context.hr(lhs, rhs)[0], string);
});

test('humanizes properties correctly', t => {
  const lhs = { last_name: 'Johnson' };
  const rhs = { last_name: 'Jacobson' };

  const string =
    '"Last Name", with a value of "Johnson" was changed to "Jacobson"';

  t.is(t.context.hr(lhs, rhs)[0], string);
});

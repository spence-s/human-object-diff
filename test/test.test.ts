import { DiffEngine as HR } from '../src/index';

describe('test', () => {
  let hr: Function;

  beforeEach(() => {
    hr = new HR().diff;
  });

  test('humanReadable is a function', () => {
    expect(typeof hr === 'function').toBeTruthy();
  });

  test('Describes an object new key addition', () => {
    const lhs = {};
    const rhs = {
      bar: 'hello world'
    };

    expect(hr(lhs, rhs)).toEqual([
      '"Bar", with a value of "hello world" (at Obj.bar) was added'
    ]);
  });

  test('Describes an object key removal', () => {
    const lhs = {
      bar: 'hello world'
    };
    const rhs = {};

    expect(hr(lhs, rhs)).toEqual([
      '"Bar", with a value of "hello world" (at Obj.bar) was removed'
    ]);
  });

  test('Describes an object key edit', () => {
    const lhs = { foo: 'hello' };
    const rhs = {
      foo: 'hello world'
    };

    expect(hr(lhs, rhs)).toEqual([
      '"Foo", with a value of "hello" (at Obj.foo) was changed to "hello world"'
    ]);
  });

  test('Describes an array insertion', () => {
    const lhs = { foo: [1, 2, 3, 4, 5, 6] };
    const rhs = {
      foo: [1, 2, 3, 8, 4, 5, 6]
    };

    expect(hr(lhs, rhs)).toEqual([
      'Array "Foo" (at Obj.foo), had a value of "8" inserted at index 3'
    ]);
  });

  test('Describes an array removal', () => {
    const lhs = { foo: [1, 2, 3, 4, 5, 6] };
    const rhs = {
      foo: [1, 2, 4, 5, 6]
    };

    expect(hr(lhs, rhs)).toEqual([
      'Array "Foo" (at Obj.foo), had a value of "3" removed at index 2'
    ]);
  });

  test('Describes an array edit', () => {
    const lhs = { foo: [1, 2, 3, 4, 5, 6] };
    const rhs = {
      foo: [1, 2, 8, 4, 5, 6]
    };

    expect(hr(lhs, rhs)).toEqual([
      'Array "Foo" (at Obj.foo), had a value of "3" changed to "8" at index 2'
    ]);
  });
});

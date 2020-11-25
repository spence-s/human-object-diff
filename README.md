# human-object-diff

[![build status](https://img.shields.io/travis/com/Spence-S/human-object-diff.svg)](https://travis-ci.com/Spence-S/human-object-diff)
[![code coverage](https://img.shields.io/codecov/c/github/Spence-S/human-object-diff.svg)](https://codecov.io/gh/Spence-S/human-object-diff)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)
[![license](https://img.shields.io/github/license/Spence-S/human-object-diff.svg)](LICENSE)
[![npm downloads](https://img.shields.io/npm/dt/human-object-diff.svg)](https://npm.im/human-object-diff)

> Configurable Human Readable Difference Between Two Plain Objects

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Configuring](#configuring)
  - [Options](#options)
  - [Custom Templates](#custom-templates)
  - [Support for Dates](#support-for-dates)
  - [Prefiltering](#prefiltering)
- [Contributors](#contributors)
- [License](#license)

## Install

[npm][]:

```bash
npm install human-object-diff
```

[yarn][]:

```bash
yarn add human-object-diff
```

## Usage

```js
const humanDiff = require('human-object-diff');

const lhs = { foo: 'bar' };
const rhs = { foo: 'baz' };
const options = {};

const { diff } = new HumanDiff(options);

console.log(diff(lhs, rhs));
// -> ['"Foo", with a value of "bar" (at Obj.foo) was changed to "baz"']
```

## Configuring

### Options

`human-object-diff` supports a variety of options to allow you to take control over the output of your object diff.

| Option       | type        | Default                            | Description                                                                                     |
| ------------ | ----------- | ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| objectName   | String      | 'Obj'                              | This is the object name when presented in the path. ie... "Obj.foo" ignored if hidePath is true |
| prefilter    | Array\|Func |                                    | see [prefiltering](#prefiltering)                                                               |
| dateFormat   | String      | 'MM/dd/yyyy hh:mm a'               | dateFns format string see [below](#support-for-dates)                                           |
| ignoreArrays | Bool        | false                              | If array differences aren't needed. Set to true and skip processing                             |
| templates    | Object      | see [templates](#custom-templates) | Completely customize the output.                                                                |

### Custom Templates

`human-object-dff` let's you fully customize your sentences by allowing you to pass custom sentence templates.

The default template looks like the following:

```js
const templates = {
  N: '"FIELD", with a value of "NEWVALUE" (at DOTPATH) was added',
  D: '"FIELD", with a value of "OLDVALUE" (at DOTPATH) was removed',
  E:
    '"FIELD", with a value of "OLDVALUE" (at DOTPATH) was changed to "NEWVALUE"',
  I:
    'Array "FIELD" (at DOTPATH), had a value of "NEWVALUE" inserted at index INDEX',
  R:
    'Array "FIELD" (at DOTPATH), had a value of "OLDVALUE" removed at index INDEX',
  AE:
    'Array "FIELD" (at DOTPATH), had a value of "OLDVALUE" changed to "NEWVALUE" at index INDEX',
  NS: '"FIELD" (at DOTPATH) was added',
  DS: '"FIELD" (at DOTPATH) was removed',
  ES: '"FIELD" (at DOTPATH) was changed',
  IS: 'Array "FIELD" (at DOTPATH), had a value inserted at index INDEX',
  RS: 'Array "FIELD" (at DOTPATH), had a value removed at index INDEX',
  AES: 'Array "FIELD" (at DOTPATH), had a value changed at index INDEX'
};
```

Where N is a new key, D is a deleted key, E is an edited key, I is an inserted array value, R is a removed array value, and AE is an edited array property.

We also expose a sensitiveFields array option which will cause a path to use the S option template.

You can define each sentence in templates to be whatever you'd like them to be and you can use the following codes that will be replaced by their diff values in the final output.

The available values you can plug in to your sentences are `FIELD`, `DOTPATH`,`NEWVALUE`,`OLDVALUE`, `INDEX`, `POSITION`. Position is just index+1. Be aware that not all sentence types will have values for each token. For instance non array changes will not have a position or an index.

### Support for Dates

`human-object-diff` uses `date-fns` format function under the hood to show human readable date differences. We also supply a `dateFormat` option where you can supply your own date formatting string. Please note, that date-fns format strings are different from moment.js format strings. Please refer to the documentation [here](https://date-fns.org/v2.8.1/docs/format) and [here](https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md)

### Prefiltering

There may be some paths in your object diffs that you'd like to ignore. You can do that with prefiltering. As a convenience, ou can add this option as an array of strings, which are the keys of the base path of the object.

for instance

```js
const lhs = { foo: 'bar', biz: { foo: 'baz' } };
const rhs = { foo: 'bar', biz: { foo: 'buzz' } };

hrDiff(lhs, rhs, { prefilter: ['foo'] });
```

You would still see the diffs for `biz.foo` but you would ignore the diff for `foo`.

You can also pass a function for this option which will be directly passed to the [underlying diff library](https://www.npmjs.com/package/deep-diff).

The prefilter function takes a signature of `function(path, key)`. Here path is an array that represents the path leading up to the object property. The key is the key, or what would be the final element of the path. The function returns true for any paths you would want to ignore.

For instance, in the object below:

```js
const obj = { foo: { bar: [1, 2, { baz: 'buzz' }] } };
```

The path and key for `foo` would be path \[] and key 'foo'.

The path and key for `foo.bar` would be path \['foo'] key 'bar'

for `foo.bar[2].baz` it would be path: \['foo', 'bar', 2] and key 'baz'

To ignore changes in `foo.bar` you could pass a functions like

```js
const prefilter = (path, key) => path[0] === 'foo' && key === 'bar';
```

## A Note On Arrays

`human-object-diff` parses arrays in an opinionated way. It does it's best to resolve Arrays into groups of insertions and removals. Typical diff libraries look at arrays on an element by element basis and emit a difference for every changes element. While this is benefical for many programatic tasks, humans typically don't look at arrays in the same way. `human-object-diff` attempts to reduce array changes to a number of insertions, removals, and edits. An example can better describe the difference.

```js
const lhs = [1, 2, 3, 4];
const rhs = [0, 1, 2, 3, 4];
```

Consider the above arrays and their differences. A typical array diff would behave like this and output something like the following.

1. A change at index 0 from 1 to 0
2. A change at index 1 from 2 to 1
3. A change at index 2 from 3 to 2
4. A change at index 3 from 4 to 3
5. An addition of 4 at index 4

`human-object-diff` attempts to reduce these differences to something like the following.

1. An insertion of 0 at index 0. ("Array 'lhs' had a value of 0 inserted at index 0")

This is much more understandable to a human brain. We've simply inserted a number at an index.

## Contributors

| Name               | Website                    |
| ------------------ | -------------------------- |
| **Spencer Snyder** | <http://spencersnyder.io/> |

## License

[MIT](LICENSE) © [Spencer Snyder](http://spencersnyder.io/)

##

[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/

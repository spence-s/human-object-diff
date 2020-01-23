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

* [Install](#install)
* [Usage](#usage)
  * [Support for Dates](#support-for-dates)
* [Contributors](#contributors)
* [License](#license)


## Install

[npm][]:

```sh
npm install human-object-diff
```

[yarn][]:

```sh
yarn add human-object-diff
```


## Usage

```js
const humanDiff = require('human-object-diff');

const lhs = { foo: 'bar' };
const rhs = { foo: 'baz' };
const options = {};

const diff = humanDiff(lhs, rhs, options);

console.log(humanObjectDiff.renderName());
// -> ['Foo", with a value of "bar" (at Obj.foo) was changed to "baz"']
```

### Support for Dates

`human-object-diff` uses `date-fns` format function under the hood
to show human readable date differences. We also supply a
`dateFormat` option where you can supply your own
date formatting string. Please note, that date-fns format
strings are different from moment.js format strings. Please
refer to the documentation [here](https://date-fns.org/v2.8.1/docs/format) and [here](https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md)


## Contributors

| Name               | Website                    |
| ------------------ | -------------------------- |
| **Spencer Snyder** | <http://spencersnyder.io/> |


## License

[MIT](LICENSE) © [Spencer Snyder](http://spencersnyder.io/)


## 

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/

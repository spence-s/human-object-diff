const isArray = require('./utils/is-array');
const appendDotPath = require('./utils/append-dot-path');

class Diff {
  constructor(diff) {
    this.kind = diff.kind;
    this.index = diff.index;
    this.lhs = diff.lhs;
    this.rhs = diff.rhs;
    this.item = diff.item;
    this.path = diff.path;
    this.isArray = isArray(diff);
    this.dotpath = appendDotPath(diff);
  }
}

module.exports = Diff;

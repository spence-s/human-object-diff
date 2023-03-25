const diff = require('./engine/index.js');
const defaults = require('./engine/utils/defaults.js');

class DiffEngine {
  constructor(config = {}) {
    config = { ...defaults, ...config };
    const { templates, ...conf } = config;
    this.config = conf;
    this.templates = { ...defaults.templates, ...templates };
    this.sentenceDiffs = [];
    this.sentences = [];
    this.diff = diff.bind(this);
  }
}

module.exports = DiffEngine;

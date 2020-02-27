const diff = require('./src/engine');
const defaults = require('./src/engine/utils/defaults');

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

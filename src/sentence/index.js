const getNewVal = require('./utils/get-new-val');
const getField = require('./utils/get-field');
const getDotpath = require('./utils/get-dot-path');
const getOldVal = require('./utils/get-old-val');

class DiffSentence {
  constructor(diff, config, templates) {
    const context = { diff, config, templates };
    this.diff = diff;
    this.FIELD = getField.call(context);
    this.OLDVALUE = getOldVal.call(context);
    this.NEWVALUE = getNewVal.call(context);
    this.DOTPATH = getDotpath.call(context);
    this.INDEX = diff.index;
    this.POSITION = diff.index && diff.index - 1;
    this.template = this.getTemplate(context);
    this.format = this.format.bind(this);
  }

  format() {
    let sentence = this.template;
    const tokens = [
      'FIELD',
      'DOTPATH',
      'NEWVALUE',
      'OLDVALUE',
      'INDEX',
      'POSITION'
    ];
    for (const token of tokens) sentence = sentence.replaceAll(token, this[token]);
    return sentence;
  }

  getTemplate({ config, templates, diff }) {
    if (config.sensitivePaths.includes(diff.dotpath))
      return templates[`${diff.kind}S`];
    return templates[diff.kind];
  }
}

module.exports = DiffSentence;

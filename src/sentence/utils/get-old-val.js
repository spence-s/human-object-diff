const formatPropertyValue = require('./format-property-value.js');

function getOldValue() {
  let formatted = '';
  if (this.diff.lhs)
    formatted = formatPropertyValue(this.diff.lhs, this.config);
  else if (this.diff.val) {
    formatted = formatPropertyValue(this.diff.val, this.config);
  }

  return formatted.replace(/"/g, '');
}

module.exports = getOldValue;

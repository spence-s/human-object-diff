const formatPropertyValue = require('./format-property-value');

function getNewValue() {
  let formatted;
  if (this.diff.val)
    formatted = formatPropertyValue(this.diff.val, this.config);
  else if (this.diff.rhs)
    formatted = formatPropertyValue(this.diff.rhs, this.config);
  else formatted = '';
  return formatted.replace(/"/g, '');
}

module.exports = getNewValue;

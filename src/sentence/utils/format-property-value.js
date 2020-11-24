const format = require('date-fns/format');

function formatPropertyValue(value, config) {
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value);
  if (value instanceof Date) return `${format(value, config.dateFormat)}`;
  return JSON.stringify(value);
}

module.exports = formatPropertyValue;

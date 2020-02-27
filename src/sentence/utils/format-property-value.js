const format = require('date-fns/format');

function formatPropertyValue(val, config) {
  if (typeof val === 'string') return `"${val}"`;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (val instanceof Date) return `${format(val, config.dateFormat)}`;
  return JSON.stringify(val);
}

module.exports = formatPropertyValue;

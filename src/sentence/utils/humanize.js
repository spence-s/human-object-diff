const humanizeStr = require('humanize-string');
const titleize = require('titleize');

function humanize(prop, config) {
  return config.dontHumanizePropertyNames ? prop : titleize(humanizeStr(prop));
}

module.exports = humanize;

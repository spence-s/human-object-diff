const deepdiff = require('deep-diff');
const format = require('date-fns/format');
const humanizeStr = require('humanize-string');
const titleize = require('titleize');
const processArray = require('./process-array');
const strFormatter = require('./format');

const saveForArrayPreProcessing = diff =>
  diff.kind === 'A' || typeof diff.path[diff.path.length - 1] === 'number';

function humanReadableDiff(lhs, rhs, config = {}) {
  const objectName = config.objectName || 'Obj';
  const dontHumanizePropertyNames = config.dontHumanizePropertyNames || false;
  const dateFormat = config.dateFormat || 'MM/dd/yyyy hh:mm a';
  const ignoreArrays = config.ignoreArrays || false;
  const sensitivePaths = config.sensitivePaths || [];
  const arrayMem = [];

  const templates = {
    N: '"FIELD", with a value of "NEWVALUE" (at DOTPATH) was added',
    D: '"FIELD", with a value of "OLDVALUE" (at DOTPATH) was removed',
    E:
      '"FIELD", with a value of "OLDVALUE" (at DOTPATH) was changed to "NEWVALUE"',
    I:
      'Array "FIELD" (at DOTPATH), had a value of "NEWVALUE" inserted at index INDEX',
    R:
      'Array "FIELD" (at DOTPATH), had a value of "OLDVALUE" removed at index INDEX',
    AE:
      'Array "FIELD" (at DOTPATH), had a value of "OLDVALUE" changed to "NEWVALUE" at index INDEX',
    NS: '"FIELD" (at DOTPATH) was added',
    DS: '"FIELD" (at DOTPATH) was removed',
    ES: '"FIELD" (at DOTPATH) was changed',
    IS: 'Array "FIELD" (at DOTPATH), had a value inserted at index INDEX',
    RS: 'Array "FIELD" (at DOTPATH), had a value removed at index INDEX',
    AES: 'Array "FIELD" (at DOTPATH), had a value changed at index INDEX',
    ...config.templates
  };

  let prefilter;
  if (Array.isArray(config.prefilter))
    prefilter = (path, key) =>
      path.length === 0 && config.prefilter.includes(key);
  else if (typeof config.prefilter === 'function') prefilter = config.prefilter;

  function humanize(prop) {
    return dontHumanizePropertyNames ? prop : titleize(humanizeStr(prop));
  }

  function formatPropertyValue(val) {
    if (typeof val === 'string') return `"${val}"`;
    if (typeof val === 'number' || typeof val === 'boolean') return String(val);
    if (val instanceof Date) return `${format(val, dateFormat)}`;
    return JSON.stringify(val);
  }

  function getField(diff) {
    let propertyIndex = diff.path.length - 1;
    while (typeof diff.path[propertyIndex] !== 'string') propertyIndex -= 1;
    const property = diff.path[propertyIndex];
    return humanize(property);
  }

  function getOldVal(diff) {
    let formatted = '';
    // if (diff.kind === 'N') formatted = formatPropertyValue(diff.rhs);
    if (diff.lhs) formatted = formatPropertyValue(diff.lhs);
    else if (diff.val) {
      formatted = formatPropertyValue(diff.val);
    }

    return formatted.replace(/"/g, '');
  }

  function getDotPath(diff) {
    if (diff.dotPath) {
      diff.path = diff.dotPath.split('.');
      return `${objectName}.${diff.dotPath}`;
    }

    const path = diff.path.reduce(
      (acc, val, i) =>
        typeof val === 'string'
          ? typeof diff.path[i + 1] === 'string'
            ? acc.concat(`${String(val)}.`)
            : acc.concat(String(val))
          : typeof diff.path[i + 1] === 'string'
          ? acc.concat(`[${String(val)}].`)
          : acc.concat(`[${String(val)}]`),
      ''
    );

    return `${objectName}.${path}`;
  }

  function getNewVal(diff) {
    let formatted;
    if (diff.val) formatted = formatPropertyValue(diff.val);
    else if (diff.rhs) formatted = formatPropertyValue(diff.rhs);
    else formatted = '';
    return formatted.replace(/"/g, '');
  }

  function reducer(acc, diff) {
    // don't process array diffs
    // until they have been pre-processed
    if (saveForArrayPreProcessing(diff)) {
      if (!ignoreArrays) arrayMem.push(diff);
      return acc;
    }

    const DOTPATH = getDotPath(diff);

    let str = '';
    if (sensitivePaths.includes(DOTPATH.replace(`${objectName}.`, '')))
      str = templates[`${diff.kind}S`];
    else str = templates[diff.kind];

    const diffString = strFormatter(str, {
      FIELD: getField(diff),
      DOTPATH: getDotPath(diff),
      OLDVALUE: getOldVal(diff),
      NEWVALUE: getNewVal(diff),
      INDEX: diff.index,
      POSITION: diff.index - 1
    });

    return acc.concat(diffString);
  }

  function humanReadable(lhs, rhs) {
    const differences = deepdiff(lhs, rhs, prefilter);
    if (!differences) return [];
    const changes = differences.reduce(reducer, []);
    const arrDiffs = processArray(arrayMem, lhs, rhs);
    const changeStrings = changes.concat(arrDiffs.reduce(reducer, []));
    return changeStrings;
  }

  return humanReadable(lhs, rhs);
}

module.exports = humanReadableDiff;

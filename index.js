const deepdiff = require('deep-diff');
const format = require('date-fns/format');
const humanizeStr = require('humanize-string');
const titleize = require('titleize');
const processArray = require('./src/process-array');

/**
 * For non-array values
 * (array values are special and need
 * different handling to detect correctly.)
 *
 * 1) property name string
 * which is the first non array-index path string eg... 'name'
 * if it is an array it will say "Array 'name'"
 *
 * 2) property value string
 * is written as "with a value of 'value'"
 *
 * 3) list path (optional)
 * path in dot notation. eg...'(at Obj,a.b[1].c)' where dots
 * indicate object addresses and brackets indicate array indices
 *
 * 4) verb
 * the verb tells what type of change occurred
 * enum [changed, added, removed]
 * can select past tense or present tense
 * ie...'was changed' or 'will be changed'
 * for added and removed plain values this will end the string
 *
 * 4b) If the verb was changed - we need to show the change
 * ie... was changed to x
 */
const saveForArrayPreProcessing = diff =>
  diff.kind === 'A' || typeof diff.path[diff.path.length - 1] === 'number';

function humanReadableDiff(lhs, rhs, config = {}) {
  const objectName = config.objectName || 'Obj';
  const dontHumanizePropertyNames = config.dontHumanizePropertyNames || false;
  const tense = config.tense || 'past';
  // const noTechTerms = config.noTechTerms || false;
  const dateFormat = config.dateFormat || 'MM/dd/yyyy hh:mm a';
  const hidePath = config.hidePath || false;
  const ignoreArrays = config.ignoreArrays || false;
  const arrayMem = [];

  function humanize(prop) {
    return dontHumanizePropertyNames ? prop : titleize(humanizeStr(prop));
  }

  function getPropertyString(diff) {
    let propertyIndex = diff.path.length - 1;
    while (typeof diff.path[propertyIndex] !== 'string') propertyIndex -= 1;
    const property = diff.path[propertyIndex];
    if (diff.dotPath) return `Array "${humanize(property)}"`;
    return `"${humanize(property)}"`;
  }

  function formatPropertyValue(val) {
    if (typeof val === 'string') return `"${val}"`;
    if (typeof val === 'number' || typeof val === 'boolean')
      return `"${String(val)}"`;
    if (val instanceof Date) return `"${format(val, dateFormat)}"`;
    return JSON.stringify(val);
  }

  function getPropertyValueString(diff) {
    let formatted = '';
    if (diff.kind === 'N') formatted = formatPropertyValue(diff.rhs);
    if (diff.kind === 'D' || diff.kind === 'E')
      formatted = formatPropertyValue(diff.lhs);
    if (diff.val) {
      formatted = formatPropertyValue(diff.val);
      return ` had a value of ${formatted}`;
    }

    return ` with a value of ${formatted}`;
  }

  function getPathString(diff) {
    if (hidePath) return '';

    if (diff.dotPath) {
      diff.path = diff.dotPath.split('.');
      return `(at ${objectName}.${diff.dotPath})`;
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
    return `(at ${objectName}.${path})`;
  }

  function getVerbString(diff) {
    const verb = {
      N: 'added',
      D: 'removed',
      E: 'changed',
      I: 'inserted',
      R: 'removed'
    }[diff.kind];

    const preVerb = tense === 'past' ? 'was' : 'will be';

    if (['I', 'R'].includes(diff.kind)) return `${verb}`;

    return `${preVerb} ${verb}${
      verb === 'changed' ? ` to ${formatPropertyValue(diff.rhs)}` : ''
    }`;
  }

  function reducer(acc, diff) {
    // don't process array diffs
    // until they have been pre-processed
    if (!ignoreArrays && saveForArrayPreProcessing(diff)) {
      arrayMem.push(diff);
      return acc;
    }

    const property = getPropertyString(diff);
    const propertyValue = getPropertyValueString(diff);
    const path = getPathString(diff);
    const verb = getVerbString(diff);

    let diffString = '';

    if (diff.dotPath) {
      diffString = `${property} ${path},${propertyValue} ${verb} at index ${diff.index}`;
    } else if (path)
      diffString = `${property},${propertyValue} ${path} ${verb}`;
    else diffString = `${property},${propertyValue} ${verb}`;

    return acc.concat(diffString);
  }

  function humanReadable(lhs, rhs) {
    const differences = deepdiff(lhs, rhs);
    if (!differences) return [];
    const changes = differences.reduce(reducer, []);
    const arrDiffs = processArray(arrayMem, lhs, rhs);
    const changeStrings = changes.concat(arrDiffs.reduce(reducer, []));
    return changeStrings;
  }

  return humanReadable(lhs, rhs);
}

module.exports = humanReadableDiff;

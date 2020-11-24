function appendDotPath(diff) {
  if (!diff.isArray) {
    diff.dotpath = diff.path.reduce(reducer(diff), '');
    return diff.dotpath;
  }

  let propertyIndex = diff.path.length - 1;
  while (typeof diff.path[propertyIndex] !== 'string') propertyIndex -= 1;
  diff.dotpath = diff.path
    .slice(0, propertyIndex + 1)
    .reduce(reducer(diff), '');

  return diff.dotpath;
}

function reducer(diff) {
  return function (acc, value, i) {
    return typeof value === 'string'
      ? typeof diff.path[i + 1] === 'string'
        ? acc.concat(`${String(value)}.`)
        : acc.concat(String(value))
      : typeof diff.path[i + 1] === 'string'
      ? acc.concat(`[${String(value)}].`)
      : acc.concat(`[${String(value)}]`);
  };
}

module.exports = appendDotPath;

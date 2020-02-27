function isArrayDiff(diff) {
  const isArray =
    diff.kind === 'A' || typeof diff.path[diff.path.length - 1] === 'number';
  diff.isArray = isArray;
  return isArray;
}

module.exports = isArrayDiff;

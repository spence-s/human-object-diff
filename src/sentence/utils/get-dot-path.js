function getDotPath() {
  if (this.diff.dotpath) {
    // this.diff.path = this.diff.dotPath.split('.');
    return `${this.config.objectName}.${this.diff.dotpath}`;
  }

  const path = this.diff.path.reduce(
    (acc, val, i) =>
      typeof val === 'string'
        ? typeof this.diff.path[i + 1] === 'string'
          ? acc.concat(`${String(val)}.`)
          : acc.concat(String(val))
        : typeof this.diff.path[i + 1] === 'string'
        ? acc.concat(`[${String(val)}].`)
        : acc.concat(`[${String(val)}]`),
    ''
  );

  return `${this.config.objectName}.${path}`;
}

module.exports = getDotPath;

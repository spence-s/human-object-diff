function getDotPath() {
  if (this.diff.dotpath) {
    return `${this.config.objectName}.${this.diff.dotpath}`;
  }

  const path = this.diff.path.reduce(
    (acc, value, i) =>
      typeof value === 'string'
        ? typeof this.diff.path[i + 1] === 'string'
          ? acc.concat(`${String(value)}.`)
          : acc.concat(String(value))
        : typeof this.diff.path[i + 1] === 'string'
        ? acc.concat(`[${String(value)}].`)
        : acc.concat(`[${String(value)}]`),
    ''
  );

  return `${this.config.objectName}.${path}`;
}

module.exports = getDotPath;

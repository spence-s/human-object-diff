/**
 * Format the output however the user wants with provided tokens
 */

function template(str, values) {
  const tokens = [
    'FIELD',
    'DOTPATH',
    'NEWVALUE',
    'OLDVALUE',
    'INDEX',
    'POSITION'
  ];

  tokens.forEach(token => {
    str = str.replace(token, values[token]);
  });

  return str;
}

module.exports = template;

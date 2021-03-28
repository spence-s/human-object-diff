function getPrefilter(config) {
  let prefilter;

  if (Array.isArray(config.prefilter))
    prefilter = (path, key) =>
      path.length === 0 && config.prefilter.includes(key);
  else if (typeof config.prefilter === 'function') prefilter = config.prefilter;

  return prefilter;
}

module.exports = getPrefilter;

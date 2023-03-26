import type deepDiff from 'deep-diff';
import { type DiffConfigWithoutTemplates } from '../../index';

export default function getPrefilter(
  config: DiffConfigWithoutTemplates
): deepDiff.PreFilter<unknown, unknown> | undefined {
  let prefilter: deepDiff.PreFilter<unknown, unknown> | undefined;

  if (config.prefilter && Array.isArray(config.prefilter)) {
    prefilter = (path: unknown[], key): boolean =>
      Boolean(
        Array.isArray(path) &&
          path.length === 0 &&
          config.prefilter &&
          Array.isArray(config.prefilter) &&
          config.prefilter.includes(key)
      );
  } else if (typeof config.prefilter === 'function') {
    prefilter = config.prefilter;
  }

  return prefilter;
}

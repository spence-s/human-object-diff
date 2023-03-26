import humanizeStr from 'humanize-string';
import titleize from 'titleize';
import { type DiffConfig } from '../../index.js';

export default function humanize(
  prop: string,
  config: Pick<DiffConfig, 'dontHumanizePropertyNames'>
) {
  return config.dontHumanizePropertyNames ? prop : titleize(humanizeStr(prop));
}

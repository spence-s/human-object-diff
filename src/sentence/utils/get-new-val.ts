import { type DiffContext } from '../index';
import formatPropertyValue from './format-property-value';

export default function getNewValue(context: DiffContext): string {
  let formatted;
  if (context.diff.val) {
    formatted = formatPropertyValue(context.diff.val, context.config);
  } else if (context.diff.rhs) {
    formatted = formatPropertyValue(context.diff.rhs, context.config);
  } else {
    formatted = '';
  }

  return formatted.replace(/"/g, '');
}

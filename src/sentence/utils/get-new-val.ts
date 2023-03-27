import { type DiffContext } from '../index';
import formatPropertyValue from './format-property-value';

export function isDisplayable(value: unknown): boolean {
  return (
    Boolean(value) ||
    Number.isFinite(value) ||
    ['boolean', 'bigint'].includes(typeof value)
  );
}

export function getNewValue(context: DiffContext): string {
  let formatted;
  if (typeof context.diff === 'string') {
    return '';
  }

  if ('val' in context.diff && isDisplayable(context.diff.val)) {
    formatted = formatPropertyValue(context.diff.val, context.config);
  } else if ('rhs' in context.diff && context.diff.rhs) {
    formatted = formatPropertyValue(context.diff.rhs, context.config);
  } else {
    formatted = '';
  }

  return formatted.replace(/"/g, '');
}

import { type DiffContext } from '../index'
import formatPropertyValue from './format-property-value'

export default function getOldValue(context: DiffContext) {
  if (typeof context.diff === 'string') {
    return ''
  }

  let formatted = ''
  if ('lhs' in context.diff && context.diff.lhs) {
    formatted = formatPropertyValue(context.diff.lhs, context.config)
  } else if (context.diff.val) {
    formatted = formatPropertyValue(context.diff.val, context.config)
  }

  return formatted.replace(/"/g, '')
}

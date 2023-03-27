import { type DiffContext } from '../index'
import humanize from './humanize'

export default function getField(context: DiffContext): string {
  if (typeof context.diff === 'string') {
    return ''
  }

  if (context.diff.path) {
    let propertyIndex = context.diff.path.length - 1
    while (typeof context.diff.path[propertyIndex] !== 'string') {
      propertyIndex -= 1
    }

    const property = context.diff.path[propertyIndex]
    return humanize(String(property), context.config)
  }

  return ''
}

import format from 'date-fns/format'
import { type DiffConfigWithoutTemplates } from '../../types'

export default function formatPropertyValue(value: unknown, config: Pick<DiffConfigWithoutTemplates, 'dateFormat'>) {
  if (typeof value === 'string') {
    return `"${value}"`
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (typeof value === 'bigint') {
    return `${String(value)}n`
  }

  if (value instanceof Date && config.dateFormat) {
    return `${format(value, config.dateFormat)}`
  }

  return JSON.stringify(value)
}

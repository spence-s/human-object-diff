import { type DiffContext } from '../index'
import { dotPathReducer } from '../../diff/utils/append-dot-path'

export default function getDotPath(context: DiffContext): string {
  if (typeof context.diff === 'string') {
    return `${context.config.objectName}`
  }

  if (context.diff.dotPath) {
    return `${context.config.objectName}.${context.diff.dotPath}`
  }

  const { diff } = context

  const path = Array.isArray(diff.path) ? [...diff.path].reduce(dotPathReducer({ path: diff.path }), '') : ''

  // eslint-disable-next-line unicorn/consistent-destructuring
  return `${context.config.objectName}.${path}`
}

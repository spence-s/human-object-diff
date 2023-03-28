import { getNewValue } from '../src/sentence/utils/get-new-val'
import { type DiffContext } from '../src/sentence'
import { defaultConfig } from '../src/engine/utils/defaults'

function getContextForValue(value: unknown): DiffContext {
  return {
    diff: {
      path: [],
      dotPath: '',
      kind: 'I',
      index: 0,
      val: value,
    },
    templates: defaultConfig().templates,
    config: defaultConfig(),
  }
}

describe('get new value', () => {
  it('positive number', () => {
    expect(getNewValue(getContextForValue(5))).toEqual('5')
  })

  it('zero number', () => {
    expect(getNewValue(getContextForValue(0))).toEqual('0')
  })

  it('false boolean', () => {
    expect(getNewValue(getContextForValue(false))).toEqual('false')
  })

  it('bigint zero number', () => {
    expect(getNewValue(getContextForValue(0n))).toEqual('0n')
  })
})

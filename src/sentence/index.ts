import { type DiffConfig, type DiffConfigWithoutTemplates } from '../types'
import { type Change } from '../engine/utils/array-preprocessor'
import type Diff from '../diff'
import { getNewValue } from './utils/get-new-val'
import getField from './utils/get-field'
import getDotpath from './utils/get-dot-path'
import getOldVal from './utils/get-old-val'

type Token = 'FIELD' | 'DOTPATH' | 'NEWVALUE' | 'OLDVALUE' | 'INDEX' | 'POSITION'

export type DiffContext = {
  diff: string | Change | Diff
  config: DiffConfigWithoutTemplates
  templates: DiffConfig['templates']
}

export default class DiffSentence {
  private readonly template: string
  private readonly diff: string | Change | Diff

  private readonly 'FIELD': string
  private readonly 'DOTPATH': string
  private readonly 'NEWVALUE': string
  private readonly 'OLDVALUE': string
  private readonly 'INDEX': string
  private readonly 'POSITION': string

  constructor(diff: string | Change | Diff, config: DiffConfigWithoutTemplates, templates: DiffConfig['templates']) {
    const context: DiffContext = { diff, config, templates }
    this.diff = diff
    this.FIELD = getField(context)
    this.OLDVALUE = getOldVal(context)
    this.NEWVALUE = getNewValue(context)
    this.DOTPATH = getDotpath(context)
    if (typeof diff !== 'string') {
      this.INDEX = String(diff.index)
    }

    if (typeof diff !== 'string') {
      this.POSITION = String(diff.index && diff.index - 1)
    }

    this.template = this.getTemplate(context)
    this.format = this.format.bind(this)
  }

  format(): string {
    let sentence = this.template
    const tokens: Token[] = ['FIELD', 'DOTPATH', 'NEWVALUE', 'OLDVALUE', 'INDEX', 'POSITION']
    for (const token of tokens) {
      sentence = sentence.replace(new RegExp(token, 'g'), this[token])
    }

    return sentence
  }

  getTemplate({ config, templates, diff }: DiffContext): string {
    if (typeof diff === 'string') {
      return diff
    }

    return templates[this.getTemplateKey(config, diff)]
  }

  private getTemplateKey(config: DiffConfigWithoutTemplates, diff: Change | Diff): keyof DiffContext['templates'] {
    if (config.sensitivePaths.includes(diff.dotPath)) {
      if (diff.kind === 'A') {
        throw new Error('Diff kind AS is not handled')
      }

      if (
        diff.kind === 'N' ||
        diff.kind === 'D' ||
        diff.kind === 'E' ||
        diff.kind === 'I' ||
        diff.kind === 'R' ||
        diff.kind === 'AE'
      ) {
        return `${diff.kind}S`
      }

      throw new Error(`Diff kind ${diff.kind}S is not handled`)
    }

    if (diff.kind === 'A') {
      throw new Error('Diff kind A is not handled')
    }

    return diff.kind
  }
}

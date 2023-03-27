import { humanReadableDiffGenerator } from './engine'
import { defaultConfig } from './engine/utils/defaults'
import type DiffSentence from './sentence'
import { type DiffConfig, type DiffConfigWithoutTemplates, type InputDiffConfig } from './types'

class DiffEngine {
  public diff

  protected readonly sentenceDiffs: DiffSentence[]
  protected readonly sentences: string[]

  private readonly config: DiffConfigWithoutTemplates
  private readonly templates

  constructor(config: InputDiffConfig = {}) {
    const cfg: DiffConfig = {
      ...defaultConfig(),
      ...config,
      templates: {
        ...defaultConfig().templates,
        ...config.templates,
      },
    }
    const { templates, ...conf } = cfg
    this.config = conf
    this.templates = { ...defaultConfig().templates, ...templates }
    this.sentenceDiffs = []
    this.sentences = []
    this.diff = humanReadableDiffGenerator({
      config: this.config,
      sentenceDiffs: this.sentenceDiffs,
      templates: this.templates,
      sentences: this.sentences,
    })
  }
}

// CommonJS export
module.exports = DiffEngine

// ES module export
export default DiffEngine

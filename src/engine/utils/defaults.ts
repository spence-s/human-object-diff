import { type DefaultDiffConfig } from '../../types'

export function defaultConfig(): DefaultDiffConfig {
  return {
    dateFormat: 'MM/dd/yyyy hh:mm a',
    objectName: 'Obj',
    ignoreArrays: false,
    sensitivePaths: [],
    dontHumanizePropertyNames: false,
    templates: {
      N: '"FIELD", with a value of "NEWVALUE" (at DOTPATH) was added',
      D: '"FIELD", with a value of "OLDVALUE" (at DOTPATH) was removed',
      E: '"FIELD", with a value of "OLDVALUE" (at DOTPATH) was changed to "NEWVALUE"',
      I: 'Array "FIELD" (at DOTPATH), had a value of "NEWVALUE" inserted at index INDEX',
      R: 'Array "FIELD" (at DOTPATH), had a value of "OLDVALUE" removed at index INDEX',
      AE: 'Array "FIELD" (at DOTPATH), had a value of "OLDVALUE" changed to "NEWVALUE" at index INDEX',
      NS: '"FIELD" (at DOTPATH) was added',
      DS: '"FIELD" (at DOTPATH) was removed',
      ES: '"FIELD" (at DOTPATH) was changed',
      IS: 'Array "FIELD" (at DOTPATH), had a value inserted at index INDEX',
      RS: 'Array "FIELD" (at DOTPATH), had a value removed at index INDEX',
      AES: 'Array "FIELD" (at DOTPATH), had a value changed at index INDEX',
    },
  }
}

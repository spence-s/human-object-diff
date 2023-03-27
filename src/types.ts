import type deepDiff from 'deep-diff';
import type DiffSentence from './sentence';

export type DefaultDiffConfig = {
  dateFormat: string; // 'MM/dd/yyyy hh:mm a',
  objectName: string; // 'Obj',
  ignoreArrays: boolean; // False,
  sensitivePaths: string[];
  dontHumanizePropertyNames: boolean; // False,
  templates: {
    N: string; // '"FIELD", with a value of "NEWVALUE" (at DOTPATH) was added';
    D: string; // '"FIELD", with a value of "OLDVALUE" (at DOTPATH) was removed';
    E: string; // '"FIELD", with a value of "OLDVALUE" (at DOTPATH) was changed to "NEWVALUE"';
    I: string; // 'Array "FIELD" (at DOTPATH), had a value of "NEWVALUE" inserted at index INDEX';
    R: string; // 'Array "FIELD" (at DOTPATH), had a value of "OLDVALUE" removed at index INDEX';
    AE: string; // 'Array "FIELD" (at DOTPATH), had a value of "OLDVALUE" changed to "NEWVALUE" at index INDEX';
    NS: string; // '"FIELD" (at DOTPATH) was added';
    DS: string; // '"FIELD" (at DOTPATH) was removed';
    ES: string; // '"FIELD" (at DOTPATH) was changed';
    IS: string; // 'Array "FIELD" (at DOTPATH), had a value inserted at index INDEX';
    RS: string; // 'Array "FIELD" (at DOTPATH), had a value removed at index INDEX';
    AES: string; // 'Array "FIELD" (at DOTPATH), had a value changed at index INDEX';
  };
};

export type DiffConfig = DefaultDiffConfig & {
  prefilter?: deepDiff.PreFilter<unknown, unknown> | undefined;
};

export type DiffConfigWithoutTemplates = Omit<DiffConfig, 'templates'>;

export type InputDiffConfig = Partial<{
  dateFormat: DefaultDiffConfig['dateFormat']; // 'MM/dd/yyyy hh:mm a',
  objectName: DefaultDiffConfig['objectName']; // 'Obj',
  ignoreArrays: DefaultDiffConfig['ignoreArrays']; // False,
  sensitivePaths: DefaultDiffConfig['sensitivePaths'];
  dontHumanizePropertyNames: DefaultDiffConfig['dontHumanizePropertyNames']; // False,
  templates: Partial<DefaultDiffConfig['templates']>;
  prefilter: deepDiff.PreFilter<unknown, unknown> | undefined;
}>;

export type DiffEngineContext = {
  // Diff: (lhs: unknown, rhs: unknown) => string;
  sentenceDiffs: DiffSentence[];
  sentences: string[];
  config: DiffConfigWithoutTemplates;
  templates: DefaultDiffConfig['templates'];
};

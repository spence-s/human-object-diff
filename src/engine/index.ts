import deepDiff from 'deep-diff';
import DiffSentence from '../sentence/index';
import Diff from '../diff/index';
import { type DiffEngineContext } from '../types';
import { preProcessArrayDiffs } from './utils/array-preprocessor';
import getPrefilter from './utils/get-prefilter';

export function humanReadableDiffGenerator(
  context: DiffEngineContext
): (lhs: unknown, rhs: unknown) => string[] {
  return (lhs: unknown, rhs: unknown): string[] => {
    const arrayDiffs = [];
    const sentences = [];
    const computedPreFilter = getPrefilter(context.config);

    const differences = deepDiff(lhs, rhs, computedPreFilter);

    if (!differences) {
      return [];
    }

    for (const singleDeepDiff of differences) {
      const diff = new Diff(singleDeepDiff);

      if (diff.isArray) {
        if (!context.config.ignoreArrays) {
          arrayDiffs.push(diff);
        }

        continue;
      }

      const sentenceDiff = new DiffSentence(
        diff,
        context.config,
        context.templates
      );
      context.sentenceDiffs.push(sentenceDiff);
      sentences.push(sentenceDiff.format());
    }

    if (!context.config.ignoreArrays) {
      for (const diff of preProcessArrayDiffs(arrayDiffs, lhs, rhs)) {
        const sentenceDiff = new DiffSentence(
          diff,
          context.config,
          context.templates
        );
        context.sentenceDiffs.push(sentenceDiff);
        sentences.push(sentenceDiff.format());
      }
    }

    return sentences;
  };
}

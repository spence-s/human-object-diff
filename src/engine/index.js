const deepdiff = require('deep-diff');
const preProcessArrayDiffs = require('./utils/array-preprocessor');
const DiffSentence = require('../sentence');
const Diff = require('../diff');
const getPrefilter = require('./utils/get-prefilter');

function humanReadableDiff(lhs, rhs) {
  const arrayDiffs = [];
  this.sentenceDiffs = [];
  this.sentences = [];
  this.computedPreFilter = getPrefilter(this.config);

  const differences = deepdiff(lhs, rhs, this.computedPreFilter);

  if (!differences) return [];

  for (let diff of differences) {
    diff = new Diff(diff);

    if (diff.isArray) {
      if (!this.config.ignoreArrays) arrayDiffs.push(diff);
      continue;
    }

    const sentenceDiff = new DiffSentence(diff, this.config, this.templates);
    this.sentenceDiffs.push(sentenceDiff);
    this.sentences.push(sentenceDiff.format());
  }

  if (!this.config.ignoreArrays)
    for (const diff of preProcessArrayDiffs(arrayDiffs, lhs, rhs)) {
      const sentenceDiff = new DiffSentence(diff, this.config, this.templates);
      this.sentenceDiffs.push(sentenceDiff);
      this.sentences.push(sentenceDiff.format());
    }

  return this.sentences;
}

module.exports = humanReadableDiff;

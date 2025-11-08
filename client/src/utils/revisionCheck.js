/**
 * Checks if a single question needs to be revised.
 * A question needs revision if:
 * 1. It has never been revised (status: 'unrevised').
 * 2. It was revised, but more than 7 days ago.
 */
export const needsRevision = (question) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const needs = (
    question.status === 'unrevised' ||
    (question.lastRevisedAt && new Date(question.lastRevisedAt) < oneWeekAgo)
  );
  
  return needs;
};
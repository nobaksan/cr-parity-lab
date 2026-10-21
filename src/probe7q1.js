/**
 * Count the words in a text.
 * @param {string} text - The text to split.
 * @returns {number} The number of whitespace-separated words.
 */
function word_count_q1(text) {
  const trimmed = text.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}

/**
 * Upper-case the first letter of a word.
 * @param {string} word - The word to capitalize.
 * @returns {string} The capitalized word.
 */
function capitalize_q1(word) {
  return word === "" ? word : word[0].toUpperCase() + word.slice(1);
}

export { word_count_q1, capitalize_q1 };

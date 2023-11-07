/**
 * @typedef {Object} DictionayType
 * @property {string[]} pinyins
 * @property {string[]} tones
 * @property {Object.<string, Object.<string, string[]>>} characterDict
 
 */

/**
 * Get a random target from dictionaries. Lexical gaps are avoided.
 * @param {DictionayType} dictionaries 
 * @returns {{pinyin: string, tone: string, character: string}} random target object
 */
export function getRandomTarget(dictionaries) {
  // get random pinyin and tone, avoid lexical gaps
  let pinyin = null;
  let tone = null;
  let pinyinIndex = null;
  let toneIndex = null;
  do {
    pinyinIndex = Math.floor(Math.random() * dictionaries.pinyins.length);
    toneIndex = Math.floor(Math.random() * dictionaries.tones.length);
    pinyin = dictionaries.pinyins[pinyinIndex];
    tone = dictionaries.tones[toneIndex];
  } while (!isValidPinyin(dictionaries, pinyin, tone));
  
  // get random character from characterDict
  const character = getCharacter(dictionaries, pinyin, tone);
  
  return {
    pinyin: pinyin,
    tone: tone,
    character: character,
  }
}

/**
 * Check if a pinyin and tone combination is valid.
 * @param {DictionayType} dictionaries 
 * @param {string} pinyin 
 * @param {string} tone 
 * @returns {boolean}
 */
export function isValidPinyin(dictionaries, pinyin, tone) {
  return ((pinyin in dictionaries.characterDict) && dictionaries.characterDict[pinyin][tone] !== null);
}

/**
 * Randomly get a character from dictionaries for a given pinyin and tone.
 * @param {DictionayType} dictionaries 
 * @param {string} pinyin 
 * @param {string} tone 
 * @returns {string | null} random character
 */
export function getCharacter(dictionaries, pinyin, tone) {
  if (isValidPinyin(dictionaries, pinyin, tone)) {
    const characterIndex = Math.floor(Math.random() * dictionaries.characterDict[pinyin][tone].length);
    return dictionaries.characterDict[pinyin][tone][characterIndex];
  } else {
    return null;
  }
}
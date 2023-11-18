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
  const _pinyin = u2v(pinyin);
  return ((_pinyin in dictionaries.characterDict) && dictionaries.characterDict[_pinyin][tone] !== null);
}

/**
 * Randomly get a character from dictionaries for a given pinyin and tone.
 * @param {DictionayType} dictionaries 
 * @param {string} pinyin 
 * @param {string} tone 
 * @returns {string} random character for the given pinyin and tone, or '⊗' if the pinyin and tone combination is invalid
 */
export function getCharacter(dictionaries, pinyin, tone) {
  if (isValidPinyin(dictionaries, pinyin, tone)) {
    const characterIndex = Math.floor(Math.random() * dictionaries.characterDict[pinyin][tone].length);
    return dictionaries.characterDict[pinyin][tone][characterIndex];
  } else {
    return '⊗';
  }
}

/**
 * 
 * @param {string} pinyin 
 * @returns pinyin with 'ü' replaced by 'v'
 */
export function u2v(pinyin) {
  if (pinyin.includes('ü')) {
    return pinyin.replace('ü', 'v');
  }
  return pinyin;
}

/**
 * 
 * @param {string} pinyin 
 * @returns pinyin with 'v' replaced by 'ü'
 */
export function v2u(pinyin) {
  if (pinyin.includes('v')) {
    return pinyin.replace('v', 'ü');
  }
  return pinyin;
}
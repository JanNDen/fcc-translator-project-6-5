// Import dictionaries
let americanOnly = require("./american-only.js");
let americanToBritishSpelling = require("./american-to-british-spelling.js");
let americanToBritishTitles = require("./american-to-british-titles.js");
let britishOnly = require("./british-only.js");

// Reorder the object keys based on length - in order to correctly translate chippy VS chip shop
const reorderObject = (obj) => {
  const keyArray = Object.keys(obj).sort((a, b) => b.length - a.length);
  let object = {};
  keyArray.map((item) => {
    object[item] = obj[item];
  });
  return object;
};

// Escape the period char in keys- in order to correctly translate Mr. VS Mrs.
// .replace(/\./, "\\.")

americanOnly = reorderObject(americanOnly);
americanToBritishSpelling = reorderObject(americanToBritishSpelling);
americanToBritishTitles = reorderObject(americanToBritishTitles);
britishOnly = reorderObject(britishOnly);

// Reverse Spelling and Titles for British->American translation
const reverseObject = (obj) => {
  return Object.entries(obj).reduce((acc, entry) => {
    const [key, value] = entry;
    acc[value] = key;
    return acc;
  }, {});
};
const britishToAmericanSpelling = reverseObject(americanToBritishSpelling);
const britishToAmericanTitles = reverseObject(americanToBritishTitles);

// Translator Class
class Translator {
  // Set default values
  constructor(text, locale, highlight) {
    this.original = text;
    this.locale = locale;
    this.highlight = highlight;
    this.translation = text;
  }

  translate() {
    // Set neutral variables
    let highlightOpenTag = '<span class="highlight">';
    let highlightCloseTag = "</span>";
    let completeDictionary = {};
    let originalTimeFormat = new RegExp("");
    let newTimeFormat = "";

    // Decide whether to highlight changes
    if (this.highlight === false) {
      highlightOpenTag = "";
      highlightCloseTag = "";
    }

    // Choose our dictionaries
    if (this.locale === "american-to-british") {
      Object.assign(
        completeDictionary,
        americanToBritishTitles,
        americanToBritishSpelling,
        americanOnly
      );
      originalTimeFormat = /(\d+):(\d+)/;
      newTimeFormat = ".";
    } else if (this.locale === "british-to-american") {
      Object.assign(
        completeDictionary,
        britishToAmericanTitles,
        britishToAmericanSpelling,
        britishOnly
      );
      originalTimeFormat = /(\d+)\.(\d+)/;
      newTimeFormat = ":";
    }

    // Translate words
    Object.entries(completeDictionary).map((item) => {
      let [key, value] = item;

      // Escape the period char in keys- in order to correctly translate Mrs. VS Mr.
      key = key.replace(/\./, "\\.");

      const regexObject = new RegExp(`(\\W+|^)(${key})(\\W+|$)`, "gi");
      const match = regexObject.exec(this.translation);
      if (match) {
        // Preserve capital letter at the beginning of matched words
        const firstLetterOfMatchedWord = match[2][0];
        value =
          firstLetterOfMatchedWord === firstLetterOfMatchedWord.toUpperCase()
            ? value.replace(value[0], value[0].toUpperCase())
            : value;

        // Proceed with the translation
        this.translation = this.translation.replace(
          regexObject,
          `$1${highlightOpenTag}${value}${highlightCloseTag}$3`
        );
      }
    });

    // Format time
    this.translation = this.translation.replace(
      originalTimeFormat,
      `${highlightOpenTag}$1${newTimeFormat}$2${highlightCloseTag}`
    );

    // Verify whether something was actually translated
    this.translation =
      this.original === this.translation
        ? "Everything looks good to me!"
        : this.translation;
  }
}

module.exports = Translator;

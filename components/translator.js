const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

// Reverse Spelling and Titles
const reverseObject = (obj) => {
  return Object.entries(obj).reduce((acc, entry) => {
    const [key, value] = entry;
    acc[value] = key;
    return acc;
  }, {});
};
const britishToAmericanSpelling = reverseObject(americanToBritishSpelling);
const britishToAmericanTitles = reverseObject(americanToBritishTitles);

class Translator {}

module.exports = Translator;

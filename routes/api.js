"use strict";

const Translator = require("../components/translator.js");

module.exports = function (app) {
  app.route("/api/translate").post((req, res) => {
    // Initialize variables
    const { text, locale } = req.body;
    const highlight = true;

    // Verify variables
    if (text === "") return res.json({ error: "No text to translate" });
    if (!text || !locale)
      return res.json({ error: "Required field(s) missing" });
    if (locale !== "american-to-british" && locale !== "british-to-american")
      return res.json({ error: "Invalid value for locale field" });

    // Proceed to translation
    const translator = new Translator(text, locale, highlight);
    translator.translate();
    return res.json({
      text: translator.original,
      translation: translator.translation,
    });
  });
};

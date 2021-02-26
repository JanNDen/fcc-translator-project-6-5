"use strict";

const Translator = require("../components/translator.js");

module.exports = function (app) {
  const translator = new Translator();

  app.route("/api/translate").post((req, res) => {
    // Initialize variables
    const { text, locale } = req;

    // Verify variables
    if (!text || !locale)
      return res.json({ error: "Required field(s) missing" });
    if (text === "") return res.json({ error: "No text to translate" });
    if (locale !== "american-to-british" && locale !== "british-to-american")
      return res.json({ error: "Invalid value for locale field" });

    // Proceed to translation
    translator.translate(text, locale);
    return res.json({
      text: translator.text,
      translation: translator.translation,
    });
  });
};

"use strict";

const handlebars = require("handlebars");

const registerHelpers = () => {
  handlebars.registerHelper("answerCount", (answers) => {
    const keys = Object.keys(answers);
    return keys.length;
  });

  handlebars.registerHelper("ifEqualsUsers", (a, b, options) => {
    if (a === b) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  return handlebars;
};

module.exports = registerHelpers();

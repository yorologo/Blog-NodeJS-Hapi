"use strict";

const { Questions } = require("../models/index");

const setAnswerRight = async (questionId, answerId, user) => {
  let result;
  try {
    result = await Questions.setAnswerRight(questionId, answerId, user);
  } catch (error) {
    console.error(error);
  }

  return result;
};

module.exports = { setAnswerRight: setAnswerRight };

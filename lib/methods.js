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

const getLast = async (amount) => {
  let data;
  try {
    data = await Questions.getLast(amount);
  } catch (error) {
    console.error(error);
  }

  console.log("ejecutando GETLAST");

  return data;
};

module.exports = {
  setAnswerRight: setAnswerRight,
  getLast: getLast,
};

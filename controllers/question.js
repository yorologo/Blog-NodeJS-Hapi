"use strict";

const { Questions } = require("../models/questions");

const nuevaPregunta = async (request, h) => {
  let resultado;
  try {
    result = await Questions.create(request.payload, request.state.user);
  } catch (error) {
    console.error(error);
    return h
      .view("ask", {
        title: "Nueva pregunta",
        error: "Problemas creando la pregunta",
      })
      .code(500)
      .takeover();
  }
  return h.response(`Pregunta creada con el ID: ${resultado}`);
};

module.exports = {
  newQuestion: nuevaPregunta,
};

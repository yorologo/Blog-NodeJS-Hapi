"use strict";

const { Questions } = require("../models/index");

const nuevaPregunta = async (request, h) => {
  if (!request.state.user) {
    return h.redirect("/login");
  }

  let resultado;
  try {
    resultado = await Questions.create(request.payload, request.state.user);
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

const responder = async (request, h) => {
  if (!request.state.user) {
    return h.redirect("/login");
  }

  let resultado;
  try {
    resultado = await Questions.answer(request.payload, request.state.user);
    console.log(`Respuesta creada: ${resultado}`);
  } catch (error) {
    console.error(error);
  }
  return h.redirect(`/question/${request.payload.id}`);
};

const marcarRespuestaCorrecta = async (request, h) => {
  if (!request.state.user) {
    return h.redirect("/login");
  }

  let resultado;
  try {
    resultado = await request.server.methods.setAnswerRight(
      request.params.questionId,
      request.params.answerId,
      request.state.user
    );
  } catch (error) {
    console.error(error);
  }
  return h.redirect(`/question/${request.params.questionId}`);
};

module.exports = {
  newQuestion: nuevaPregunta,
  answerQuestion: responder,
  setAnswerRight: marcarRespuestaCorrecta,
};

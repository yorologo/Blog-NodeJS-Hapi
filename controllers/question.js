"use strict";

const { v1: uuid } = require("uuid");
const { writeFile } = require("fs");
const { promisify } = require("util");
const { join } = require("path");
const { Questions } = require("../models/index");

const write = promisify(writeFile);

const nuevaPregunta = async (request, h) => {
  if (!request.state.user) {
    return h.redirect("/login");
  }

  let resultado, filename;
  try {
    if (Buffer.isBuffer(request.payload.image)) {
      filename = `${uuid()}.png`;
      await write(
        join(__dirname, "..", "public", "uploads", filename),
        request.payload.image
      );
    }
    resultado = await Questions.create(
      request.payload,
      request.state.user,
      filename
    );
  } catch (error) {
    server.log('error', error);
    return h
      .view("ask", {
        title: "Nueva pregunta",
        error: "Problemas creando la pregunta",
      })
      .code(500)
      .takeover();
  }

  return h.redirect(`/question/${resultado}`);
};

const responder = async (request, h) => {
  if (!request.state.user) {
    return h.redirect("/login");
  }

  let resultado;
  try {
    resultado = await Questions.answer(request.payload, request.state.user);
    server.log('info', `Respuesta creada: ${resultado}`);
  } catch (error) {
    server.log('error', error);
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
    server.log('error', error);
  }
  return h.redirect(`/question/${request.params.questionId}`);
};

module.exports = {
  newQuestion: nuevaPregunta,
  answerQuestion: responder,
  setAnswerRight: marcarRespuestaCorrecta,
};

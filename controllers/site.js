"use strict";

const { Questions } = require("../models/index");

const home = async (request, h) => {
  const data = await request.server.methods.getLast(10);

  return h.view("index", {
    title: "home",
    user: request.state.user,
    questions: data,
  });
};

const registro = (request, h) => {
  if (request.state.user) {
    return h.redirect("/");
  }
  return h.view("register", {
    title: "Registro",
    user: request.state.user,
  });
};

const acceso = (request, h) => {
  if (request.state.user) {
    return h.redirect("/");
  }
  return h.view("login", {
    title: "Acceso",
    user: request.state.user,
  });
};

const nuevaPregunta = (request, h) => {
  if (!request.state.user) {
    return h.redirect("/login");
  }
  return h.view("ask", {
    title: "Nueva pregunta",
    user: request.state.user,
  });
};

const verPregunta = async (request, h) => {
  let data;
  try {
    data = await Questions.getOne(request.params.id);
    if (!data) {
      return inexistente(request, h);
    }
  } catch (error) {
    console.error(error);
  }
  return h.view("question", {
    title: "Ver pregunta",
    user: request.state.user,
    question: data,
    key: request.params.id,
  });
};

const validacionFallida = async (request, h, error) => {
  const templates = {
    "/create-user": "register",
    "/validate-user": "login",
    "/create-question": "ask",
  };
  return h
    .view(templates[request.path], {
      title: "Error de validacion",
      error: "Datos o credenciales rechazadas",
    })
    .code(400)
    .takeover();
};

const inexistente = (request, h) => {
  return h.view("404", {}, { layout: "error-layout" }).code(404);
};

const archivoInexistente = (request, h) => {
  const response = request.response;
  if (response.isBoom && response.output.statusCode === 404) {
    return h.view("404", {}, { layout: "error-layout" }).code(404);
  }
  return h.continue;
};

module.exports = {
  home: home,
  register: registro,
  login: acceso,
  ask: nuevaPregunta,
  viewQuestion: verPregunta,
  failValidation: validacionFallida,
  notFound: inexistente,
  fileNotFound: archivoInexistente,
};

"use strict";

const { Questions } = require("../models/index");

const home = async (request, h) => {
  let data;
  try {
    data = await Questions.getLast(10);
  } catch (error) {
    console.error(error);
  }

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

const validacionFallida = async (request, h, error) => {
  const templates = {
    "/create-user": "register",
    "/validate-user": "login",
    "/create-question": "ask",
  };
  return h
    .view(templates[request.path], {
      title: "Error de validacion",
      error: "Por favor completa los campos requeridos",
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
  failValidation: validacionFallida,
  notFound: inexistente,
  fileNotFound: archivoInexistente,
};

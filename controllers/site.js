"use strict";

const home = (request, h) => {
  return h.view("index", {
    title: "home",
    user: request.state.user,
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

const inexistente = (request, h) => {
  return h.view("404", {}, { layout: "error-layout" }).code(404);
};

module.exports = {
  home: home,
  register: registro,
  login: acceso,
  notFound: inexistente,
};

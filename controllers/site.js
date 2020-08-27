"use strict";

const home = (request, h) => {
  return h.view("index", {
    title: "home",
    user: request.state.user,
  });
};

const registro = (request, h) => {
  return h.view("register", {
    title: "Registro",
    user: request.state.user,
  });
};

const acceso = (request, h) => {
  return h.view("login", {
    title: "Acceso",
    user: request.state.user,
  });
};

module.exports = {
  home: home,
  register: registro,
  login: acceso,
};

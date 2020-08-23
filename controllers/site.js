"use strict";

const home = (request, h) => {
  return h.view("index", {
    title: "home",
  });
};

const registro = (request, h) => {
  return h.view("register", {
    title: "Registro",
  });
};

const acceso = (request, h) => {
  return h.view("login", {
    title: "Acceso",
  });
};

module.exports = {
  home: home,
  register: registro,
  login: acceso,
};

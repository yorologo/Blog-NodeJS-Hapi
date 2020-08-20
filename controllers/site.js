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

module.exports = {
  home: home,
  register: registro,
};

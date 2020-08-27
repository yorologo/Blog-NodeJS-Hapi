"use strict";

const { Users } = require("../models/index");

const usuarioCreado = async (request, h) => {
  let result;
  try {
    result = await Users.create(request.payload);
  } catch (error) {
    console.error(error);
    return h.response("Problemas creando el usuario").code(500);
  }
  return h.response(`Usuario creado ID:${result}`);
};

const validarUsuario = async (request, h) => {
  let result;
  try {
    result = await Users.validate(request.payload);
    if (!result) return h.response("Email y/o contraseña incorrecta").code(401);
  } catch (error) {
    console.error(error);
    return h.response("Problemas validando el usuario").code(500);
  }
  return h.redirect("/").state("user", {
    name: result.name,
    email: result.email,
  });
};

const cerrarSesion = async (request, h) => {
  return h.redirect("/login").unstate("user");
};

module.exports = {
  createdUser: usuarioCreado,
  validatedUser: validarUsuario,
  logoutUser: cerrarSesion,
};

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
  } catch (error) {
    console.error(error);
    return h.response("Problemas validando el usuario").code(500);
  }
  return h.response(result);
};

module.exports = {
  createdUser: usuarioCreado,
  validatedUser: validarUsuario,
};

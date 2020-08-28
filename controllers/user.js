"use strict";

const boom = require("@hapi/boom");
const { Users } = require("../models/index");

const usuarioCreado = async (request, h) => {
  let result;
  try {
    result = await Users.create(request.payload);
  } catch (error) {
    console.error(error);
    return h.view("register", {
      title: "Registro",
      error: "Problemas creando el usuario",
    });
  }
  return h.view("register", {
    title: "Registro",
    success: "Usuario creado exitosamente",
  });
};

const validarUsuario = async (request, h) => {
  let result;
  try {
    result = await Users.validate(request.payload);
    if (!result) {
      return h.view("login", {
        title: "Acceso",
        error: "Email y/o contraseña incorrecta",
      });
    }
  } catch (error) {
    console.error(error);
    return h.view("login", {
      title: "Acceso",
      error: "Problemas validando el usuario",
    });
  }
  return h.redirect("/").state("user", {
    name: result.name,
    email: result.email,
  });
};

const validacionFallida = async (request, h, error) => {
  boom.badRequest("La validacion del usuario ha fallado", req.payload);
};

const cerrarSesion = async (request, h) => {
  return h.redirect("/login").unstate("user");
};

module.exports = {
  createdUser: usuarioCreado,
  validatedUser: validarUsuario,
  logoutUser: cerrarSesion,
  failValidation: validacionFallida,
};

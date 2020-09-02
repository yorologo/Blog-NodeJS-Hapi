"use strict";

const boom = require("@hapi/boom");
const { Users } = require("../models/index");

const usuarioCreado = async (request, h) => {
  let resultado;
  try {
    resultado = await Users.create(request.payload);
  } catch (error) {
    console.error(error);
    return h
      .view("register", {
        title: "Registro",
        error: "Problemas creando el usuario",
      })
      .code(500);
  }
  return h.view("register", {
    title: "Registro",
    success: "Usuario creado exitosamente",
  });
};

const validarUsuario = async (request, h) => {
  let resultado;
  try {
    resultado = await Users.validate(request.payload);
    if (!resultado) {
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
    name: resultado.name,
    email: resultado.email,
  });
};

const validacionFallida = async (request, h, error) => {
  const templates = {
    "/create-user": "register",
    "/validate-user": "login",
  };
  return h
    .view(templates[request.path], {
      title: "Error de validacion",
      error: "Por favor completa los campos requeridos",
    })
    .code(400)
    .takeover();
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

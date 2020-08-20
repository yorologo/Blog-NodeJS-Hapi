"use strict";

const usuarioCreado = (request, h) => {
  console.log(request.payload);
  return "Usuario creado exitosamente";
};

module.exports = {
  createdUser: usuarioCreado,
};

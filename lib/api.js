"use strict";

const joi = require("joi");
const questions = require("../models/index").Questions;
const boom = require("@hapi/boom");

module.exports = {
  name: "api-rest",
  version: "0.1.0",
  async register(server, options) {
    const prefix = options.prefix || "api";

    server.route({
      method: "GET",
      path: `/${prefix}/question/{key}`,
      options: {
        validate: {
          params: joi.object({
            key: joi.string().required(),
          }),
          failAction: failValidation,
        },
      },
      handler: async (request, h) => {
        let result;
        try {
          result = await questions.getOne(request.params.key);
          if (!result) {
            boom.notFound(
              `No se pudo encontrar la pregunta ${request.params.key}`
            );
          }
        } catch (error) {
          return boom.badImplementation(
            `Hubo un error buscando ${request.params.key}`
          );
        }

        return result;
      },
    });

    server.route({
      method: "GET",
      path: `/${prefix}/questions/{amount}`,
      options: {
        validate: {
          params: joi.object({
            amount: joi.number().integer().min(1).max(20).required(),
          }),
          failAction: failValidation,
        },
      },
      handler: async (request, h) => {
        let result;
        try {
          result = await questions.getLast(request.params.amount);
          if (!result) {
            boom.notFound(`No se han podido recuperar las preguntas`);
          }
        } catch (error) {
          return boom.badImplementation(`Hubo un error buscando las preguntas`);
        }

        return result;
      },
    });

    function failValidation(request, h, error) {
      return boom.badRequest(
        "Porfavor use los parametros requeridos correctamente"
      );
    }
  },
};

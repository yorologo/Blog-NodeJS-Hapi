"use strict";

const joi = require("joi");
const boom = require("@hapi/boom");
const authBasic = require("@hapi/basic");
const questions = require("../models/index").Questions;
const users = require("../models/index").Users;

module.exports = {
  name: "api-rest",
  version: "0.1.0",
  async register(server, options) {
    const prefix = options.prefix || "api";

    await server.register(authBasic);
    server.auth.strategy("simple", "basic", { validate: validateAuth });

    server.route({
      method: "GET",
      path: `/${prefix}/question/{key}`,
      options: {
        auth: "simple",
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
          console.log(result);
          if (!result) {
            return boom.notFound(
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
        auth: "simple",
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
            return boom.notFound(`No se han podido recuperar las preguntas`);
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

    async function validateAuth(request, username, password, h) {
      let user;
      try {
        user = await users.validate({ email: username, password: password });
      } catch (error) {
        server.log("error", error);
      }

      return {
        credentials: user || {},
        isValid: user !== false,
      };
    }
  },
};

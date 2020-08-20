"use strict";

const hapi = require("@hapi/hapi");

const init = async () => {
  const server = hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Hola mundo!";
    },
  });

  try {
    await server.start();
    console.log(`Servidor lanzado en: ${server.info.uri}`);
  } catch {
    console.error(error);
    process.exit(1);
  }
};

init();

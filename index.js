"use strict";

const hapi = require("@hapi/hapi");
const inert = require("@hapi/inert");
const path = require("path");

const init = async () => {
  const server = hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
    routes: {
      files: {
        relativeTo: path.join(__dirname, "public"),
      },
    },
  });

  await server.register(inert);

  server.route({
    method: "GET",
    path: "/home",
    handler: (request, h) => {
      return h.file("index.html");
    },
  });

  server.route({
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: ".",
        index: ["index.html"],
      },
    },
  });

  await server.start();
  console.log(`Servidor lanzado en: ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();

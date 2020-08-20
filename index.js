"use strict";

const hapi = require("@hapi/hapi");
const handlebars = require("handlebars");
const inert = require("@hapi/inert");
const path = require("path");
const vision = require("vision");
const { dirname } = require("path");

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
  await server.register(vision);

  server.views({
    engines: {
      hbs: handlebars,
    },
    relativeTo: __dirname,
    path: "views",
    layout: true,
    layoutPath: "views",
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return h.view("index", {
        title: "home",
      });
    },
  });

  server.route({
    method: "GET",
    path: "/register",
    handler: (request, h) => {
      return h.view("register", {
        title: "Registro",
      });
    },
  });

  server.route({
    method: "POST",
    path: "/create-user",
    handler: (request, h) => {
      console.log(request.payload);
      return "Usuario creado exitosamente";
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

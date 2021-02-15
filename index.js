"use strict";

const hapi = require("@hapi/hapi");
const inert = require("@hapi/inert");
const vision = require("@hapi/vision");
const laabr = require("laabr");
const path = require("path");
const routes = require("./routes");
const handlebars = require("./lib/helpers");
const site = require("./controllers/site");
const methods = require("./lib/methods");

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
  await server.register({
    plugin: laabr,
    options: {},
  });
  await server.register({
    plugin: require("./lib/api"),
    options: { prefix: "api" },
  });

  server.method("setAnswerRight", methods.setAnswerRight);
  server.method("getLast", methods.getLast, {
    cache: {
      expiresIn: 1000 * 60,
      generateTimeout: 2000,
    },
  });

  server.state("user", {
    ttl: 1000 * 60 * 60 * 24,
    isSecure: process.env.NODE_ENV === "prod",
    encoding: "base64json",
  });

  server.views({
    engines: {
      hbs: handlebars,
    },
    relativeTo: __dirname,
    path: "views",
    layout: true,
    layoutPath: "views",
  });

  server.ext("onPreResponse", site.fileNotFound);
  server.route(routes);

  await server.start();
};

process.on("unhandledRejection", (err) => {
  server.log("error", err);
  process.exit(1);
});

process.on("unhandledException", (err) => {
  server.log("error", err);
  process.exit(1);
});

init();

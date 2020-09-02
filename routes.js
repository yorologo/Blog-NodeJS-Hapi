"use strict";

const joi = require("joi");
const site = require("./controllers/site");
const user = require("./controllers/user");
const question = require("./controllers/question");

module.exports = [
  {
    method: "GET",
    path: "/",
    handler: site.home,
  },
  {
    method: "GET",
    path: "/register",
    handler: site.register,
  },
  {
    method: "POST",
    options: {
      validate: {
        payload: joi.object({
          name: joi.string().min(3).required(),
          password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
          email: joi.string().email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] },
          }),
        }),
        failAction: site.failValidation,
      },
    },
    path: "/create-user",
    handler: user.createdUser,
  },
  {
    method: "GET",
    path: "/login",
    handler: site.login,
  },
  {
    method: "GET",
    path: "/logout",
    handler: user.logoutUser,
  },
  {
    method: "POST",
    options: {
      validate: {
        payload: joi.object({
          password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
          email: joi.string().email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] },
          }),
        }),
        failAction: site.failValidation,
      },
    },
    path: "/validate-user",
    handler: user.validatedUser,
  },
  {
    method: "GET",
    path: "/ask",
    handler: site.ask,
  },
  {
    method: "POST",
    options: {
      validate: {
        payload: joi.object({
          title: joi.string().min(5).required(),
          description: joi.string(),
        }),
        failAction: site.failValidation,
      },
    },
    path: "/create-question",
    handler: question.newQuestion,
  },
  {
    method: "GET",
    path: "/assets/{param*}",
    handler: {
      directory: {
        path: ".",
        index: ["index.html"],
      },
    },
  },
  {
    method: ["GET", "POST"],
    path: "/{any*}",
    handler: site.notFound,
  },
];

"use strict";

const joi = require("joi");
const site = require("./controllers/site");
const user = require("./controllers/user");

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
      },
    },
    path: "/create-user",
    handler: user.createdUser,
  },
  {
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: ".",
        index: ["index.html"],
      },
    },
  },
];

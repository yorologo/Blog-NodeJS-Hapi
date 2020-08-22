"use strict";

var admin = require("firebase-admin");
var serviceAccount = require("../config/firbase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://myblog-nodejs-hapi.firebaseio.com",
});

const db = admin.database();
const Users = require("./users");

module.exports = {
  Users: new Users(db),
};

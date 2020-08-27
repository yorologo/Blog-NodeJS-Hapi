"use strict";

const bcrypt = require("bcrypt");

class Users {
  constructor(db) {
    this.db = db;
    this.ref = this.db.ref("/");
    this.collection = this.ref.child("users");
  }

  async create(data) {
    // Se destructura el objeto enviado porque Hapi lo decora
    // con un prototipo null que no es compatible con Firebase
    //
    // [Object: null prototype] {
    //     name: 'Fulano Gomez',
    //     email: 'correo@email.com',
    //     password: 'secreto' }

    const user = {
      ...data,
    };
    user.password = await this.constructor.encrypt(user.password);
    const newUser = this.collection.push(user);
    newUser.set(user);

    return newUser.key;
  }

  async validate(data) {
    const user = {
      ...data,
    };
    const userQuery = await this.collection
      .orderByChild("email")
      .equalTo(user.email)
      .once("value");
    const userFound = userQuery.val();
    if (userFound) {
      const userId = Object.keys(userFound)[0];
      const passwordRight = await bcrypt.compare(
        user.password,
        userFound[userId].password
      );
      if (passwordRight) {
        return userFound[userId];
      }
      return false;
    }
    return false;
  }

  static async encrypt(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
}

module.exports = Users;

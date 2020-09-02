"use strict";

class Questions {
  constructor(db) {
    this.db = db;
    this.ref = this.db.ref("/");
    this.collection = this.ref.child("questions");
  }

  async create(data, user) {
    const question = {
      ...data,
    };
    question.owner = user;
    const newQuestion = this.collection.push();
    newQuestion.set(question);

    return newQuestion.key;
  }

  async getLast(amount) {
    const query = await this.collection.limitToLast(amount).once("value");
    return query.val();
  }

  async getOne(id) {
    const query = await this.collection.child(id).once("value");
    return query.val();
  }
}

module.exports = Questions;

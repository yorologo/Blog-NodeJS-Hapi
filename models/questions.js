"use strict";

class Questions {
  constructor(db) {
    this.db = db;
    this.ref = this.db.ref("/");
    this.collection = this.ref.child("questions");
  }

  async create(info, user, filename) {
    const question = {
      description: info.description,
      title: info.title,
    };

    if (filename) {
      question.filename = filename;
    }

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

  async answer(data, user) {
    const answer = {
      ...data,
    };
    console.log(data, answer);
    const answers = await this.collection
      .child(data.id)
      .child("answers")
      .push();
    answers.set({
      text: answer.answer,
      user: user,
    });
    return answers;
  }

  async setAnswerRight(questionId, answerId, user) {
    const query = await this.collection.child(questionId).once("value");
    const question = query.val();
    const answers = question.answers;

    if (user.email === question.owner.email) {
      for (const key in answers) {
        answers[key].correct = key === answerId;
      }

      const update = await this.collection
        .child(questionId)
        .child("answers")
        .update(answers);
      return update;
    }
    return false;
  }
}

module.exports = Questions;

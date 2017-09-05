/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    firstName: {type: 'string'},

    lastName: {type: 'string'},

    email: {type: 'string'},

    password: {type: 'string'},

    posts: {
      collection: 'post',
      via: '_user'
    },
    toJSON: function () {
      let obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },
  checkPassword(password, encPassword) {
    return new Promise((resolve, reject) => {

      const mPack = require('machinepack-passwords');
      mPack.checkPassword({
        passwordAttempt: password,
        encryptedPassword: encPassword
      })
        .exec({
          error: err => reject(err),
          incorrect: () => resolve(false),
          success: () => resolve(true)
        })
    })
  }
};


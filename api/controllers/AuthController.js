/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const validator = require('email-validator');

module.exports = {



  /**
   * `AuthController.login()`
   */
  login: function (req, res) {
    return res.json({
      todo: 'login() is not implemented yet!'
    });
  },

  /**
   * `AuthController.signup()`
   */
  signup: function (req, res) {

    //extract user from form
    const firstName = req.param('firstName'),
      lastName = req.param('lastName'),
      email = req.param('email'),
      password = req.param('password');

    if (!firstName) {
      return res.badRequest({err: 'invalid first name'});
    }
    if (!lastName) {
      return res.badRequest({err: 'invalid last name'});
    }
    if (!email || validator.validate(email) === false) {
      return res.badRequest({err: 'invalid email'});
    }
    if (!password) {
      return res.badRequest({err: 'invalid password'});
    }

    const signupRequest = async () => {
      try {
        const emailExists = await User.find({email});
        if (emailExists) {
          throw `${email} is already in the database.`;
        }
        const user = await User.create({
          firstName,
          lastName,
          email,
          password
        });
        return {user};
      }
       catch (e) {
        throw e;
      }
    };
    signupRequest()
      .then(result => res.ok(result))
      .catch(err => res.notFound(err))
  }
};


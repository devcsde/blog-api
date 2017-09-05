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
    // extract email & password
    const email = req.param('email'),
      password = req.param('password');
    if (!email){
      return res.badRequest({err: 'invalid email'})
    }
    if (!password) {
      return res.badRequest({err: 'invalid password'})
    }

    const loginRequest = async () => {
      try {
        // find user by email
        const user = await User.findOne({email});
        // compare encrypted with supplied password
        const isMatch = await User.checkPassword(password, user.password);
        if(!isMatch) {
          throw new Error('Your password does not match.');
        }

        let resp = {
          user
        };
        resp.token = await JwtService.issue({
          user,
          expiresIn: '1d'
        });
        return resp;
      } catch (e) {
        throw e;
      }
    };
    loginRequest()
      .then(result => res.ok(result))
      .catch(err => res.forbidden(err));
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
        if (emailExists.length > 0) {
          throw `${email} is already in the database.`;
        }

        const encPassword = await UtilService.encryptPassword(password);

        const user = await User.create({
          firstName,
          lastName,
          email,
          password: encPassword
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

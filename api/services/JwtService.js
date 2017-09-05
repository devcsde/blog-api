const jwt = require("jsonwebtoken");
const secret = 'uhkh123kh1kj24jhg234mjb34jm67jh78h908h8d';

module.exports = {

  issue: (payload, expiresIn) => {
    return jwt.sign({payload}, secret, {expiresIn});
  },

  verify: token => {
    return jwt.verify(token, secret);
  }

};

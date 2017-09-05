const mPack = require('machinepack-passwords');

module.exports = {

  encryptPassword: password => {

    return new Promise((resolve, reject) => {
      mPack.encryptPassword({
        password
      }).exec({
        error: err => reject(err),
        success: result => resolve(result)
      });
    })
  }
};


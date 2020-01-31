const jwt = require('jsonwebtoken');

class Token {
  constructor() { }
  sign(data, hash, authtimeout) {
    var token = jwt.sign({ data: { hkid: data, time: new Date().getTime() } }, hash, { expiresIn: authtimeout });
    return token;
  }
  verify(token, hash) {
    let verify = false;
    jwt.verify(token, hash, function (err, decoded) {
      if (err) {
        verify = err.name;
      } else {
        verify = true;
      }
    });
    return verify;
  }
  decode(token) {
    if(!token){
      return false;
    }
    var decoded = jwt.decode(token);
    var data_decoded = decoded.data;
    return data_decoded;
  }
}

module.exports = Token;
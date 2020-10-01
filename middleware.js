
let jwt = require('jsonwebtoken');
const config = require('./config.js');

let checkToken = (req, res, next) => {   //In the middleware.js, we can write a function that acts as middleware 
                                        //to get a token from a request and proceeds only when the token is validated.
  let token = req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => { //validate the token with secret key using jwt package
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

module.exports = {
  checkToken: checkToken
}

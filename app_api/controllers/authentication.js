const passport = require('passport');
const mongoose = require('mongoose');
const User =  mongoose.model('User');

const register = (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return sendJsonResponse(res, 404, {'message': 'All fields are required'});
  }

  const user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.save( err => {
    if (err) { sendJsonResponse(res, 404, err) }
    else {
      const token = user.generateJwt();
      sendJsonResponse(res, 200, {token});
    }
  });
}

const login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    // console.log('All fields required', err);
    return sendJsonResponse(res, 404, {'message': 'All fields are required'});
  }
  passport.authenticate('local', (err, user, info) => {
    // let token;
    if (err) { sendJsonResponse(res, 404, err) }
    if (user) {
      token = user.generateJwt();
      sendJsonResponse(res, 200, {token});
    } else {
      sendJsonResponse(res, 401, info);
    }
  })(req, res);
}

// json resonse function
const sendJsonResponse = (res, status, content) => {
  res
    .status(status)
    .json(content);
}

module.exports = {
  register,
  login
};
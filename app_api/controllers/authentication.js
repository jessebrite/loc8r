const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return sendJsonResponse(res, 404, {
      message: 'All fields are required, please try again',
    });
  }

  let existingUser = await User.findOne({ email });
  if (existingUser) {
    return sendJsonResponse(res, 404, {
      message: 'email already exists. Please choose a new one',
    });
  }

  const user = new User();
  user.name = name;
  user.email = email;
  user.setPassword(password);
  user.save((err) => {
    if (err) {
      sendJsonResponse(res, 404, { message: 'There was an error' });
    } else {
      const token = user.generateJwt();
      sendJsonResponse(res, 200, { token });
    }
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendJsonResponse(res, 404, {
      message: 'All fields are required, please try again',
    });
  }
  passport.authenticate('local', (err, user, info) => {
    let token;
    if (err) {
      return sendJsonResponse(res, 404, err);
    } else if (!user) {
      return sendJsonResponse(res, 400, info);
    } else {
      token = user.generateJwt();
      return sendJsonResponse(res, 200, { token });
    }
  })(req, res);
};

// json resonse function
const sendJsonResponse = (res, status, content) => {
  res.status(status).json(content);
};

module.exports = {
  register,
  login,
};

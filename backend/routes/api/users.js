const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('firstName')
    // .exists({ checkFalsy: true })
    // .withMessage('First Name is required')
    .isLength({ min: 2 })
    .withMessage('First name must be more than 2 characters.'),
  check('lastName')
    // .exists({ checkFalsy: true })
    // .withMessage('Last Name is required')
    .isLength({ min: 2 })
    .withMessage('Last name must be more than 2 characters.'),
  check('email')
    // .exists({ checkFalsy: true })
    // .withMessage('Invalid email')
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    // .exists({ checkFalsy: true })
    // .withMessage('Username is required')
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  // check('username')
  //   .isLength({ min: 2 })
  //   .withMessage('Please provide a username with at least 2 characters.'),
  // .not()
  // .isEmail()
  // .withMessage('Username cannot be an email.'),
  check('password')
    // .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post('/', validateSignup, async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body

  const emailExist = await User.findOne({ where: { email } })
  const usernameExist = await User.findOne({ where: { username } })

  if (emailExist) {
    res.status(403)
    return res.json({
      "message": "User already exists",
      "statusCode": 403,
      "errors": {
        "email": "User with that email already exists"
      }
    });
  } else if (usernameExist) {
    res.status(403)
    return res.json({
      "message": "User already exists",
      "statusCode": 403,
      "errors": {
        "username": "User with that username already exists"
      }
    });
  }

  const user = await User.signup({ firstName, lastName, email, username, password });

  const token = await setTokenCookie(res, user);

  const userData = user.toJSON();
  userData.token = token;

  return res.json(userData);

});


module.exports = router;

const express = require('express');
const User = require("../models/user.js");

const { createUser, signInUser } = require("../controllers/user.js");
const { validateUserSignUp, userValidation, validateUserSignIn } = require("../middlewares/validation/user.js");

const router = express.Router();

// create user
router.post('/create-user', validateUserSignUp, userValidation, createUser );

// sign in user
router.post('/sign-in', validateUserSignIn, userValidation, signInUser);


module.exports = router;
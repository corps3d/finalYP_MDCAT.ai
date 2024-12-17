const { check, validationResult } = require ("express-validator");

exports.validateUserSignUp = [
    check('fullName')
    .trim()
     .not().isEmpty()
      .isLength({min:3, max:20}).withMessage("Name must be within 3-20 characters"),

    check('email')
    .normalizeEmail()
     .isEmail().withMessage("Invalid Email!"),

    check('password')
    .trim()
     .not().isEmpty()
      .isLength({min: 8}).withMessage("Password should be of atleast 8 characters!"),

    check('confirmPassword')
    .trim()
     .not().isEmpty()
      .custom((value, {req}) => {
        if( value !== req.body.password){
            throw new Error('The Passwords do not match!')
        }
        return true;
      })
]

exports.userValidation = (req, res, next) => {
    const result = validationResult(req).array();
    if(!result.length) return next()
    const error = result[0].msg
    return res.json({ success: "Failure", message: error});
}

exports.validateUserSignIn = [
    check('email')
    .trim()
     .isEmail().withMessage("Email field is required!"),

     check('password')
     .trim()
      .not().isEmpty().withMessage("Password field is required!")
]


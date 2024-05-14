

const { body } = require('express-validator'),
    Models = require('../../../data_access/models');

const RegistervalidationRulesRequest = () => {
    return [
        body('email').trim().exists().notEmpty().withMessage('Please enter email').isEmail().withMessage('Please enter valid email').toLowerCase().
            custom(val => {
                return Models.User.findOne({ email: val }).
                    then(resp => {
                        if (resp)
                            return Promise.reject("This email already exists");
                    })
                return true
            }),
        body('password').trim().exists().notEmpty().withMessage('Please enter password'),
    ]
}
const LoginvalidationRulesRequest = () => {
    return [
        body('email').trim().exists().notEmpty().withMessage('Please enter email').isEmail().withMessage('Please enter valid email').toLowerCase().
            custom(val => {
                return Models.User.findOne({ email: val }).
                    then(resp => {
                        if (!resp)
                            return Promise.reject("email or password is incorrect");
                    })
                return true
            }),
        body('password').trim().exists().notEmpty().withMessage('Please enter password'),
    ]
}
const forgetPasswordvalidationRulesRequest = () => {
    return [
        body('email').trim().exists().notEmpty().withMessage('Please enter email').isEmail().withMessage('Please enter valid email').toLowerCase().
            custom(val => {
                return Models.User.findOne({ email: val }).
                    then(resp => {
                        if (!resp)
                            return Promise.reject("email does not exist");
                    })
                return true
            }),
    ]
}
module.exports = {
    RegistervalidationRulesRequest,
    LoginvalidationRulesRequest,
    forgetPasswordvalidationRulesRequest
}

const { validationResult } = require("express-validator");

const ValidateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    status: 422,
    message: "validation error",
    errors: extractedErrors,
  });
};
module.exports = {
  ValidateRequest,
};

const { GeneralError } = require('../utils/errors')

const handleErrors = (err, req, res, next) => {
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      status: false,
      message: err.message
    });
  }

  return res.status(500).json({
    status: false,
    message: err.message
  });
}


module.exports = handleErrors;
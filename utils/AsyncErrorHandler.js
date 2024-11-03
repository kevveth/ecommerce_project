const asyncErrorHandler = (func) => {
    return (req, res, next) => {
      func(req, res, next).catch((err) => {
        console.error(err);
        return next(err)
      });
    }
  }

module.exports = asyncErrorHandler;
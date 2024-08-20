const errorCatchingWrapper = (middleware) => {
  return (req, res, next) => {
    middleware(req, res, next).catch((error) => next(error));
  };
};

module.exports = errorCatchingWrapper;

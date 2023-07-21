exports.authenticate = (req, res, next) => {
  if (req.session.validated) next();
  else {
    res.redirect("/login");
  }
};

exports.notAuthenticated = (req, res, next) => {
  if (!req.session.validated) next();
  else {
    res.redirect("/expense");
  }
};

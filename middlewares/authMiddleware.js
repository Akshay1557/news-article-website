

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();            // user is logged in → continue
  }
  res.redirect("/users/login"); // otherwise redirect to login
};

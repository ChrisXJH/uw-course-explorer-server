import passport from 'passport';

export const signedInRequired = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.logout();
    return req.session.destroy(err => {
      res
        .status(401)
        .clearCookie('connect.sid')
        .end();
    });
  }
  next();
};

export const oauthAuthenticate = (req, res, next) => {
  const { provider } = req.body;
  if (provider === 'facebook') {
    return passport.authenticate('facebook-token')(req, res, next);
  } else {
    return res.status(404).send({ message: 'Unknown provider.' });
  }
};

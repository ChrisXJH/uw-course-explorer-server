import passport from 'passport';

export const oauthAuthenticate = (req, res, next) => {
  const { provider } = req.body;
  if (provider === 'facebook') {
    return passport.authenticate('facebook-token')(req, res, next);
  } else {
    return res.status(404).send({ message: 'Unknown provider.' });
  }
};

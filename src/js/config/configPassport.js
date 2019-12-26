import passport from 'passport';
import FacebookTokenStrategy from 'passport-facebook-token';
import { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } from './config';

export default function() {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    if (id) done(null, { id });
    else done(null);
  });

  passport.use(
    new FacebookTokenStrategy(
      {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET
      },
      (accessToken, refreshToken, profile, done) => {
        const { id, displayName } = profile;
        return done(null, { id, accessToken, displayName });
      }
    )
  );
}

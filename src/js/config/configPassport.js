import passport from 'passport';
import FacebookTokenStrategy from 'passport-facebook-token';
import { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } from './config';
import * as userService from '../services/user/userService';

export default function() {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    userService
      .findUserById(id)
      .then(user => done(null, user.toObject()))
      .catch(error => done(error));
  });

  passport.use(
    new FacebookTokenStrategy(
      {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET
      },
      (accessToken, refreshToken, profile, done) => {
        userService
          .oauthLogin('facebook', profile)
          .then(user => done(null, { id: user.id }))
          .catch(error => done(error));
      }
    )
  );
}

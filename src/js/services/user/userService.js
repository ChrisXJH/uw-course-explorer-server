import UserModel from '../../models/user/UserModel';

export const findUserById = userId =>
  new Promise((resolve, reject) => {
    UserModel.findById(userId)
      .then(resolve)
      .catch(reject);
  });

export const getUserInfo = findUserById;

export const oauthLogin = (provider, profile) =>
  new Promise((resolve, reject) => {
    UserModel.findOne({
      oauth: {
        $elemMatch: { provider, id: profile.id }
      }
    })
      .then(foundUser => {
        if (!foundUser) {
          const newUser = new UserModel({
            displayName: profile.displayName,
            oauth: [{ id: profile.id, provider }]
          });
          return newUser.save().then(resolve);
        }
        resolve(foundUser);
      })
      .catch(reject);
  });

import UserModel from '../../models/user/UserModel';
import { UserNotFoundError } from '../../common/error/error';
import { getCourseCode } from '../../utils/utils';

export const findUserById = userId =>
  new Promise((resolve, reject) => {
    UserModel.findById(userId)
      .then(user => {
        if (!user) return reject(new UserNotFoundError());
        resolve(user);
      })
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
        const avatar = profile.photos[0] || {};
        const avatarUrl = avatar.value || '';

        if (!foundUser) {
          const newUser = new UserModel({
            displayName: profile.displayName,
            avatarUrl,
            oauth: [{ id: profile.id, provider }]
          });
          return newUser.save().then(resolve);
        }
        resolve(foundUser);
      })
      .catch(reject);
  });

export const markCourseTaken = (userId, subject, catalogNumber) =>
  UserModel.findOneAndUpdate(
    { _id: userId },
    {
      $addToSet: {
        coursesTaken: getCourseCode(subject, catalogNumber)
      }
    },
    { new: true }
  ).then(updatedUser => updatedUser.toObject().coursesTaken);

export const unMarkCourseTaken = (userId, subject, catalogNumber) =>
  UserModel.findOneAndUpdate(
    { _id: userId },
    {
      $pull: { coursesTaken: getCourseCode(subject, catalogNumber) }
    },
    { new: true }
  ).then(updatedUser => updatedUser.toObject().coursesTaken);

export const getCoursesTaken = user => {
  return user.coursesTaken;
};

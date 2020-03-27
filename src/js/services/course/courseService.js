import UserModel from '../../models/user/UserModel';
import * as UwDataService from '../uwData/uwDataService';
import * as UserService from '../user/userService';

export const getAllCourses = () => UwDataService.getCourses();

export const getCoursesBySubject = subject =>
  UwDataService.getCoursesBySubject(subject);

export const getCourseById = (courseId, req) =>
  UwDataService.getCourseById(courseId).then(course => {
    if (req && req.isAuthenticated()) {
      const { id } = req.user;
      return UserModel.findOne({
        _id: id,
        shortlistedCourses: { $in: course.course_id }
      })
        .catch(error => {
          console.error(error);
          return null;
        })
        .then(user =>
          Object.assign({}, course, { shortlisted: Boolean(user) })
        );
    }
    return Object.assign({}, course, { shortlisted: false });
  });

export const shortlistCourse = (userId, courseId) =>
  new Promise((resolve, reject) => {
    UserModel.updateOne(
      { _id: userId },
      {
        $addToSet: {
          shortlistedCourses: courseId
        }
      }
    )
      .then(({ nModified }) =>
        nModified > 0
          ? resolve()
          : reject(new Error('Failed to update shortlist'))
      )
      .catch(reject);
  });

export const unshortlistCourse = (userId, courseId) =>
  new Promise((resolve, reject) => {
    UserModel.updateOne(
      { _id: userId },
      {
        $pull: {
          shortlistedCourses: courseId
        }
      }
    )
      .then(({ nModified }) =>
        nModified > 0
          ? resolve()
          : reject(new Error('Failed to update shortlist'))
      )
      .catch(reject);
  });

// Making too many requests to uw api
// TODO: cache/store data in the server
export const getShortlistedCourses = userId =>
  UserService.findUserById(userId)
    .then(user =>
      Promise.all(
        user.shortlistedCourses.map(courseId => getCourseById(courseId))
      )
    )
    .catch(err => {
      console.error(err);
      return null;
    })
    .then(courses => courses.filter(course => course));

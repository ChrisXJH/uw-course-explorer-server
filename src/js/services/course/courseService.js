import UserModel from '../../models/user/UserModel';
import * as UwDataService from '../uwData/uwDataService';
import * as UserService from '../user/userService';
import { getCourseCode } from '../../utils/utils';

function parseCourses(str) {
  if (!str) return [];
  let match;
  const matches = [];
  const regex = /([A-Z]+)\s(\d+[A-Za-z]?)/g;

  while ((match = regex.exec(str))) {
    matches.push({
      match: match[0],
      subject: match[1],
      catalog_number: match[2],
      index: match.index
    });
  }

  return matches;
}

const setShortlisted = (course, req) => {
  if (!req || !req.isAuthenticated()) {
    course.shortlisted = false;
    return Promise.resolve(course);
  }

  const { id } = req.user;

  return UserModel.findOne({
    _id: id,
    shortlistedCourses: { $in: course.course_id }
  })
    .catch(error => {
      console.error(error);

      return course;
    })
    .then(user => {
      course.shortlisted = Boolean(user);

      return course;
    });
};

const processCourseObject = (course, req) => {
  return setShortlisted(course, req).then(course => {
    course.preReqCourseMatches = parseCourses(course.prerequisites);
    course.antiReqCourseMatches = parseCourses(course.antirequisites);

    return course;
  });
};

export const getAllCourses = () => UwDataService.getCourses();

export const getCoursesBySubject = subject =>
  UwDataService.getCoursesBySubject(subject);

export const getCourseById = (courseId, req) =>
  UwDataService.getCourseById(courseId).then(course =>
    processCourseObject(course, req)
  );

export const getCourseByCatalogNumber = ({ catalogNumber, subject }, req) =>
  UwDataService.getCourseBySubjectAndCatalogNumber(subject, catalogNumber)
    .then(course => processCourseObject(course, req))
    .catch(err => {
      console.error(err);
      throw err;
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

export const markCourseTaken = (userId, subject, catalogNumber) =>
  UserModel.updateOne(
    { _id: userId },
    {
      $addToSet: {
        coursesTaken: getCourseCode(subject, catalogNumber)
      }
    }
  ).then(({ nModified }) => {
    if (nModified === 0) throw new Error('Failed to add to taken list.');
  });

export const unMarkCourseTaken = (userId, subject, catalogNumber) =>
  UserModel.updateOne(
    { _id: userId },
    {
      $pull: { coursesTaken: getCourseCode(subject, catalogNumber) }
    }
  ).then(({ nModified }) => {
    if (nModified === 0) throw new Error('Failed to remove from taken list.');
  });

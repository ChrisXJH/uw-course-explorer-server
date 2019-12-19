import * as UwDataService from "../uwData/uwDataService";

export const getAllCourses = () => UwDataService.getCourses();

export const getCoursesBySubject = subject => UwDataService.getCoursesBySubject(subject);

export const getCourseById = courseId => UwDataService.getCourseById(courseId);

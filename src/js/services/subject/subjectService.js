import * as UwDataService from "../uwData/uwDataService";
import * as CourseService from '../course/courseService';

export const getSubjects = () => UwDataService.getSubjectCodes();

export const getCoursesBySubject = subject => CourseService.getCoursesBySubject(subject);

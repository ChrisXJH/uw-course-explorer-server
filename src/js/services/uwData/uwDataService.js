import rp from 'request-promise';
import { getUwBackendUrl, getUwApiKey } from '../../config/config';

const uwBackendUrl = getUwBackendUrl();
const uwApiKey = getUwApiKey();

export function uwDataGet(target) {
  const options = {
    uri: `${uwBackendUrl}/${target}?key=${uwApiKey}`,
    method: 'GET',
    json: true
  };

  return rp(options);
}

export function getSubjectCodes() {
  return uwDataGet('codes/subjects.json');
}

export function getCourses() {
  return uwDataGet('courses.json');
}

export function getCoursesBySubject(subject) {
  return uwDataGet(`courses/${subject}.json`);
}

export function getCourseById(courseId) {
  return uwDataGet(`courses/${courseId}.json`);
}

export function getTerms() {
  return uwDataGet('terms/list.json');
}

export function getSchedule(termId, subject, courseNumber) {
  return uwDataGet(`terms/${termId}/${subject}/${courseNumber}/schedule.json`);
}
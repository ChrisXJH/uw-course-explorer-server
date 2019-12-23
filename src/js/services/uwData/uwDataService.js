import rp from 'request-promise';
import { getUwBackendUrl, getUwApiKey } from '../../config/config';

const uwBackendUrl = getUwBackendUrl();
const uwApiKey = getUwApiKey();

const parseResponse = res => res.data;

export function uwDataGet(target) {
  const options = {
    uri: `${uwBackendUrl}/${target}?key=${uwApiKey}`,
    method: 'GET',
    json: true
  };

  return rp(options);
}

export function getSubjectCodes() {
  return uwDataGet('codes/subjects.json').then(parseResponse);
}

export function getCourses() {
  return uwDataGet('courses.json').then(parseResponse);
}

export function getCoursesBySubject(subject) {
  return uwDataGet(`courses/${subject}.json`).then(parseResponse);
}

export function getCourseById(courseId) {
  return uwDataGet(`courses/${courseId}.json`).then(parseResponse);
}

export function getTerms() {
  return uwDataGet('terms/list.json').then(parseResponse);
}

export function getSchedule(termId, subject, courseNumber) {
  return uwDataGet(
    `terms/${termId}/${subject}/${courseNumber}/schedule.json`
  ).then(parseResponse);
}

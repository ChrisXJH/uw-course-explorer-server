import rp from 'request-promise';
import { getUwBackendUrl, getUwApiKey } from '../../config/config';
import LRU from 'lru-cache';

const uwBackendUrl = getUwBackendUrl();
const uwApiKey = getUwApiKey();

const parseResponse = res => res.data;

const lruCache = new LRU({
  max: 400 * 1024 * 1024, // 400MB
  maxAge: 1000 * 60 * 60 * 12 // 12 hours
});

export function uwDataGet(target) {
  if (lruCache.has(target)) return Promise.resolve(lruCache.get(target));

  const options = {
    uri: `${uwBackendUrl}/${target}?key=${uwApiKey}`,
    method: 'GET',
    json: true
  };

  return rp(options).then(res => {
    lruCache.set(target, res);

    return res;
  });
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

export function getCourseBySubjectAndCatalogNumber(subject, catalogNumber) {
  return uwDataGet(`courses/${subject}/${catalogNumber}.json`).then(
    parseResponse
  );
}

export function getTerms() {
  return uwDataGet('terms/list.json').then(parseResponse);
}

export function getSchedule(termId, subject, courseNumber) {
  return uwDataGet(
    `terms/${termId}/${subject}/${courseNumber}/schedule.json`
  ).then(parseResponse);
}

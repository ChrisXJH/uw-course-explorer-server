import * as UwDataService from '../uwData/uwDataService';

export const getTerms = () => UwDataService.getTerms();

export const getSchedule = (termId, subject, courseNumber) =>
  UwDataService.getSchedule(termId, subject, courseNumber);

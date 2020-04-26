import { Router } from 'express';
import { signedInRequired } from '../../middleware/authMiddleware';
import * as CourseService from '../../services/course/courseService';

const router = Router();

router.get('/', (req, res) => {
  CourseService.getAllCourses()
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});

router.get('/shortlist', signedInRequired, (req, res) => {
  const { user } = req;

  CourseService.getShortlistedCourses(user._id)
    .then(courses => res.send(courses))
    .catch(err => res.status(500).send(err));
});

router.get('/:courseId', (req, res) => {
  const { courseId } = req.params;
  CourseService.getCourseById(courseId, req)
    .then(result => res.send(result))
    .catch(err => res.status(500).send(err));
});

router.get('/:subject/:catalogNumber', (req, res) => {
  const { subject, catalogNumber } = req.params;
  CourseService.getCourseByCatalogNumber({ catalogNumber, subject }, req)
    .then(result => res.send(result))
    .catch(err => res.status(500).send(err));
});

router.put('/:courseId/shortlist', signedInRequired, (req, res) => {
  const { user, params } = req;

  CourseService.shortlistCourse(user._id, params.courseId)
    .then(() => res.send({ message: 'success' }))
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.put('/:courseId/unshortlist', signedInRequired, (req, res) => {
  const { user, params } = req;

  CourseService.unshortlistCourse(user._id, params.courseId)
    .then(() => res.send({ message: 'success' }))
    .catch(err => res.status(500).send(err));
});

export default router;

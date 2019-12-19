import { Router } from "express";
import * as CourseService from "../../services/course/courseService";

const router = Router();

router.get('/', (req, res) => {
  CourseService.getAllCourses()
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});

router.get('/:courseId', (req, res) => {
  const { courseId } = req.params;
  CourseService.getCourseById(courseId)
    .then(result => res.send(result))
    .catch(err => res.status(500).send(err));
});

export default router;

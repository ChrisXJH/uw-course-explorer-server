import { Router } from "express";
import * as SubjectService from "../../services/subject/subjectService";

const router = Router();

router.get('/', (req, res) => {
  SubjectService.getSubjects()
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});

router.get('/:subject/course', (req, res) => {
  const { subject } = req.params;
  SubjectService.getCoursesBySubject(subject)
    .then(result => res.send(result))
    .catch(err => res.status(500).send(err));
});

export default router;

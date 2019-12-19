import { Router } from "express";
import * as TermService from '../../services/term/termService';

const router = Router();

router.get('/', (req, res) => {
  TermService.getTerms()
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});

router.get('/:termId/:subject/:courseNumber/schedule', (req, res) => {
  const { termId, subject, courseNumber } = req.params;
  TermService.getSchedule(termId, subject, courseNumber)
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});

export default router;

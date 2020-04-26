import { Router } from 'express';
import {
  oauthAuthenticate,
  signedInRequired
} from '../../middleware/authMiddleware';
import * as userService from '../../services/user/userService';

const router = Router();

router.get('/', signedInRequired, (req, res) => {
  const {
    _id,
    shortlistedCourses,
    coursesTaken,
    displayName,
    avatarUrl
  } = req.user;

  res.send({
    id: _id,
    shortlistedCourses,
    coursesTaken,
    displayName,
    avatarUrl
  });
});

router.get('/coursesTaken', signedInRequired, (req, res) => {
  const result = userService.getCoursesTaken(req.user);

  res.send(result);
});

router.post('/coursesTaken', signedInRequired, (req, res) => {
  const { user, body } = req;

  userService
    .markCourseTaken(user._id, body.subject, body.catalogNumber)
    .then(coursesTaken => res.send({ code: 'SUCCESS', coursesTaken }))
    .catch(error => {
      console.error(error);
      res.send({ code: 'FAILURE' });
    });
});

router.delete('/coursesTaken', signedInRequired, (req, res) => {
  const { user, query } = req;

  userService
    .unMarkCourseTaken(user._id, query.subject, query.catalogNumber)
    .then(coursesTaken => res.send({ code: 'SUCCESS', coursesTaken }))
    .catch(error => {
      console.error(error);
      res.send({ code: 'FAILURE' });
    });
});

router.get('/status', (req, res) => {
  if (req.isAuthenticated()) return res.send({ loggedIn: true });
  res.send({ loggedIn: false });
});

router.post('/oauth', oauthAuthenticate, (req, res) => {
  res.send({ message: 'ok' });
});

router.post('/logout', (req, res) => {
  if (!req.isAuthenticated()) return res.send({ message: 'ok' });
  req.logout();
  req.session.destroy(err => {
    if (err) return res.status(500).send(err);

    res.clearCookie('connect.sid').end();
  });
});

export default router;

import { Router } from 'express';
import {
  oauthAuthenticate,
  signedInRequired
} from '../../middleware/authMiddleware';
import * as userService from '../../services/user/userService';

const router = Router();

router.get('/', signedInRequired, (req, res) => {
  const { id } = req.user;
  userService
    .getUserInfo(id)
    .then(user => res.send(user.toObject()))
    .catch(error => res.status(500).send(error));
});

router.get('/status', (req, res) => {
  if (req.isAuthenticated()) return res.send({ loggedIn: true });
  res.send({ loggedIn: false });
});

router.post('/oauth', oauthAuthenticate, (req, res) => {
  res.send({ message: 'ok' });
});

export default router;

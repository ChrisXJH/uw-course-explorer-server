import { Router } from 'express';
import { oauthAuthenticate } from '../../middleware/authMiddleware';

const router = Router();

router.post('/oauth', oauthAuthenticate, (req, res) => {
  res.send(req.user);
});

export default router;

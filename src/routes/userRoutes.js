import express from 'express';
import { followUser, unfollowUser, getUserProfile } from '../controllers/userController.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.put('/follow/:userId', auth, followUser);
router.put('/unfollow/:userId', auth, unfollowUser);
router.get('/profile/:userId', auth, getUserProfile);

export default router;

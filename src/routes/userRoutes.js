import express from 'express';
import {
	followUser,
	unfollowUser,
	getUserProfile,
	getReceiverProfile,
} from '../controllers/userController.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.put('/follow/:userId', auth, followUser);
router.put('/unfollow/:userId', auth, unfollowUser);
router.get('/profile/', auth, getUserProfile);
router.get('/profile/:userId', auth, getReceiverProfile);

export default router;

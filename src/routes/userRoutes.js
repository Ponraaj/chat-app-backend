import express from "express";
import { followUser, unfollowUser, getUserProfile } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router()

router.put('/follow/:userId', authMiddleware, followUser)
router.put('/unfollow/:userId', authMiddleware, unfollowUser)
router.get('/profile/:userId', authMiddleware, getUserProfile)

export default router

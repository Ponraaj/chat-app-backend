import express from "express";
import passport from "passport";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: false }),
  (req, res) => {
    res.redirect("http://localhost:3000");
  },
);

router.get("/logout", logoutUser);

export default router;

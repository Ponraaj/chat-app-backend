import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/User.js";

export default function initPassport() {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { error: "Email does not exits ❌" });
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, {
              error: "Incorrect email or password ❌",
            });
          }
          done(null, user);
        } catch (error) {
          done(error);
        }
      },
    ),
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL || "http://localhost:6969"}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });

          if (!user) {
            user = new User({
              email: profile.emails[0].value,
              username: profile.displayName,
              password: "GOOGLE",
            });
            await user.save();
          } else {
            user.username = profile.displayName;
            await user.save();
          }
          done(null, user);
        } catch (error) {
          console.log("Error saving user: ", error);
          done(error, null);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser(async (user, done) => {
    try {
      const existing_user = await User.findOne({ email: user.email });
      if (!existing_user) {
        return done(new Error("User not found"));
      }
      done(null, existing_user);
    } catch (error) {
      done(error);
    }
  });
}

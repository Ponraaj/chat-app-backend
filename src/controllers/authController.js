import User from "../models/User.js";
import passport from "passport";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).send("Email is already registered 🔴");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).send("User registered successfully 🟢");
  } catch (error) {
    return res.status(500).send("Server error 🔴");
  }
};

export const loginUser = async (req, res) => {
  passport.authenticate("local", (error, user, info) => {
    {
      if (error) {
        return res.status(500).json({ error: "Server Error 🔴" });
      }

      if (!user) {
        return res.status(401).json(info);
      }

      req.login(user, (error) => {
        if (error) {
          return res.status(500).json({ error: "Server Error 🔴" });
        }
        return res
          .status(200)
          .json({ id: user._id, username: user.username, email: user.email });
      });
    }
  })(req, res);
};

export const logoutUser = (req, res) => {
  req.logout((error) => {
    if (error) {
      return res.status(500).json({ error: "Error Logging out the user 🔴" });
    }
    res.status(204).send("Logged out successfully 🟢");
  });
};

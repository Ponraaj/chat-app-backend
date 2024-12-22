import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import connectToDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import initPassport from './config/passport.js';
import http from 'http';

dotenv.config();
connectToDB();

const app = express();
app.use(express.json());

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

initPassport();
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 6969;

const server = http.createServer(app);

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

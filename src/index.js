import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Server } from 'socket.io';
import connectToDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import initPassport from './config/passport.js';
import http from 'http';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';

dotenv.config();
connectToDB();

const app = express();

const corsOptions = {
	origin: ['http://localhost:3000'],
	methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
	credentials: true,
	optionsSuccessStatus: 204,
	allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

const sessionStore = MongoStore.create({
	mongoUrl: process.env.MONGO_URI,
	collectionName: 'sessions',
});

const sessionMiddleware = session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	store: sessionStore,
	cookie: {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		maxAge: 1000 * 60 * 60 * 24,
	},
});

app.use(cookieParser());
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());
initPassport();

const PORT = process.env.PORT || 6969;

const server = http.createServer(app);
const io = new Server(server);

const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
	if (socket.request.user) {
		next();
	} else {
		next(new Error('unauthorized'));
	}
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('api/messages', messageRouter);

io.on('connection', (socket) => {
	const user = socket.request.user;
	console.log(`Socket ${socket.id} connected as user ${user.email}`);

	socket.on('setup', (userData) => {
		socket.join(userData._id);
		socket.emit('connected');
	});

	socket.on('disconnect', () => {
		console.log(`Socket ${socket.id} disconnected`);
		socket.leave(user._id);
	});
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

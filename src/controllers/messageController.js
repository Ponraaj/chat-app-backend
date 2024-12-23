import Message from '../models/Message.js';
import User from '../models/User.js';

// Send a new message
export const sendMessage = async (req, res) => {
	const { receiverId, text, image } = req.body;
	const senderId = req.session.passport.user;

	try {
		const receiver = await User.findById(receiverId);
		if (!receiver) {
			return res.status(404).json({ message: 'Receiver not found' });
		}

		const message = new Message({
			senderId,
			receiverId,
			text,
			image,
		});

		await message.save();

		req.app.get('socketio').to(receiverId.toString()).emit('newMessage', message);

		return res.status(201).json(message);
	} catch (error) {
		console.error('Error sending message:', error.message);
		return res.status(500).json({ message: 'Internal server error' });
	}
};

export const getMessages = async (req, res) => {
	const { userId } = req.params;

	const loggedInUserId = req.session.passport.user;
	if (!userId) {
		return res.status(400).json({ message: 'User ID is required' });
	}
	if (!loggedInUserId) {
		return res.status(401).json({ message: 'Unauthorized: Please log in' });
	}

	try {
		const messages = await Message.find({
			$or: [
				{ senderId: loggedInUserId, receiverId: userId },
				{ senderId: userId, receiverId: loggedInUserId },
			],
		}).sort({ createdAt: 1 });

		return res.status(200).json(messages);
	} catch (error) {
		console.error('Error fetching messages:', error.message);
		return res.status(500).json({ message: 'Internal server error' });
	}
};

// Delete a message
export const deleteMessage = async (req, res) => {
	const { id } = req.params;
	const loggedInUserId = req.user._id;

	try {
		const message = await Message.findById(id);

		if (!message) {
			return res.status(404).json({ message: 'Message not found' });
		}

		if (
			message.senderId.toString() !== loggedInUserId.toString() &&
			message.receiverId.toString() !== loggedInUserId.toString()
		) {
			return res.status(403).json({ message: 'Not authorized to delete this message' });
		}

		await Message.findByIdAndDelete(id);

		return res.status(200).json({ message: 'Message deleted successfully' });
	} catch (error) {
		console.error('Error deleting message:', error.message);
		return res.status(500).json({ message: 'Internal server error' });
	}
};

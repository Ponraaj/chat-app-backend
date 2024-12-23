import User from '../models/User.js';

const followUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const currentUserID = req.user._id.toString();

		const currentUser = await User.findById(currentUserID);
		const targetUser = await User.findById(userId);

		console.log(currentUser);

		if (!targetUser || currentUser.following.includes(userId)) {
			return res.status(400).json({ message: 'Cannot Follow this User 🔴' });
		}

		currentUser.following.push(userId);
		targetUser.followers.push(req.user._id);

		await currentUser.save();
		await targetUser.save();

		res.status(200).json({
			message: `${currentUser.username} started following ${targetUser.username} 📢`,
		});
	} catch (error) {
		res.status(500).json({ message: `Error following  🔴`, error: error.message });
	}
};
const unfollowUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const currentUser = User.findById(req.user._id);
		const targetUser = User.findById(userId);

		if (!targetUser || !currentUser.following.includes(userId)) {
			return res.status(400).json({ message: 'Cannot Unfollow this User 🔴' });
		}

		currentUser.following = currentUser.following.filter((id) => id.toString() !== userId);
		targetUser.followers = targetUser.followers.filter(
			(id) => id.toString() !== req.user._id.toString()
		);

		await currentUser.save();
		await targetUser.save();

		res.status(200).json({
			message: `${currentUser.username} Unfollowed ${targetUser.username} 📢`,
		});
	} catch (error) {
		res.status(500).json({
			message: `Error following ${targetUser.username} 🔴`,
			error: error.message,
		});
	}
};

const getUserProfile = async (req, res) => {
	try {
		const userId = req.session.passport.user;

		const user = await User.findById(userId)
			// .populate('posts')
			.populate('followers')
			.populate('following');

		if (!user) {
			return res.status(404).json({ message: 'User not found 🔴' });
		}

		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: 'Error retrieving profile 🔴', error: error.message });
	}
};

const getReceiverProfile = async (req, res) => {
	try {
		const { userId } = req.params;

		const user = await User.findById(userId)
			// .populate('posts')
			.populate('followers')
			.populate('following');

		if (!user) {
			return res.status(404).json({ message: 'User not found 🔴' });
		}

		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: 'Error retrieving profile 🔴', error: error.message });
	}
};

export { followUser, unfollowUser, getUserProfile, getReceiverProfile };

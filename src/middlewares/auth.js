export const auth = (req, res, next) => {
	try {
		if (req.isAuthenticated()) {
			next();
		} else {
			res.status(401).json({ error: 'Unauthorized Access 🔒' });
		}
	} catch (err) {
		res.status(500).json({ error: 'Unauthorized Access 🔒' });
	}
};

const jwt = require('jsonwebtoken');

const createJWT = (user) => {
	return jwt.sign({user}, 'secretword', { expiresIn: '1h' });
};

module.exports = { createJWT };

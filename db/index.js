const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
	const MONGODB_URI = process.env.MONGODB_URI;
	try {
		await mongoose.connect(MONGODB_URI);
		console.log('MongoDB  conectado exitosamente');
	} catch (err) {
		console.error(err);
	}
};

module.exports = { connectDB };

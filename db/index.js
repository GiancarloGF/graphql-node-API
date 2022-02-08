const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		await mongoose.connect('mongodb+srv://usuario02:rumboUNALM2723@cluster0.zn2uz.mongodb.net/blog-api?retryWrites=true&w=majority');
		console.log('MongoDB  conectado exitosamente');
	} catch (err) {
		console.error(err);
	}
};

module.exports = { connectDB };

const { GraphQLString } = require('graphql');
const { User } = require('../models');
const { createJWT } = require('../util/auth');

const register = {
	type: GraphQLString,
	description: 'Returns a string',
	args: {
		username: { type: GraphQLString },
		password: { type: GraphQLString },
		email: { type: GraphQLString },
		displayname: { type: GraphQLString },
	},
	resolve: async (_, args) => {
		const { username, password, email, displayname } = args;
		const user = await User.create({
			username,
			password,
			email,
			displayname,
		});

		/* another way to create a new user in mongodb with mongoose:
        const user = new User({
            username,
            password,
            email,
            displayname,
        })
        const user = await user.save();
        console.log(user) 
        */
		const token = createJWT({ id: user._id, username: user.username, email: user.email });
		console.log(user, token);
		return 'New user created';
	},
};

const login = {
	type: GraphQLString,
	description: 'Returns a string',
	args: {
		email: { type: GraphQLString },
		password: { type: GraphQLString },
	},
	resolve: async (_, args) => {
		const user = await User.findOne({ email: args.email });
		// const user = await User.findOne({ email: args.email }).select('+password');
		if (!user) {
			throw new Error('Usuario no encontrado con email especificado');
		}

		if(args.password !== user.password){
			throw new Error('Contraseña incorrecta');
		}

		const token = createJWT({ id: user._id, username: user.username, email: user.email });

		return token;
	},
};

module.exports = { register, login };

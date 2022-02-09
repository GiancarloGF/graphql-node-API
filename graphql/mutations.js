const { GraphQLString, GraphQLID, GraphQLNonNull } = require('graphql');
const { User, Post } = require('../models');
const { auth, bcrypt } = require('../util');

const register = {
	type: GraphQLString,
	description: 'Returns a string',
	args: {
		username: { type: new GraphQLNonNull(GraphQLString) },
		password: { type: new GraphQLNonNull(GraphQLString) },
		email: { type: new GraphQLNonNull(GraphQLString) },
		displayName: { type: new GraphQLNonNull(GraphQLString) },
	},
	resolve: async (_, args) => {
		const { username, password, email, displayName } = args;
		const user = new User({ username, email, password, displayName });
		user.password = await bcrypt.encryptPassword(user.password);
		await user.save();

		const token = auth.createJWT({ id: user._id, username: user.username, email: user.email });
		return token;
	},
};

const login = {
	type: GraphQLString,
	description: 'Returns a string',
	args: {
		email: { type: new GraphQLNonNull(GraphQLString) },
		password: { type: new GraphQLNonNull(GraphQLString) },
	},
	resolve: async (_, args) => {
		const user = await User.findOne({ email: args.email });
		// const user = await User.findOne({ email: args.email }).select('+password');
		if (!user) {
			throw new Error('Usuario no encontrado con email especificado');
		}
		const validPassword = await bcrypt.comparePassword(password, user.password);
		if (!validPassword) {
			throw new Error('Contraseña incorrecta');
		}

		const token = auth.createJWT({ id: user._id, username: user.username, email: user.email });

		return token;
	},
};

const createPost = {
	type: PostType,
	description: 'create a new blog post',
	args: {
		title: { type: new GraphQLNonNull(GraphQLString) },
		body: { type: new GraphQLNonNull(GraphQLString) },
	},
	async resolve(_, args, { verifiedUser }) {
		if (!verifiedUser) throw new Error('You must be logged in to do that');

		const userFound = await User.findById(verifiedUser._id);
		if (!userFound) throw new Error('Unauthorized');

		const post = new Post({
			authorId: verifiedUser._id,
			title: args.title,
			body: args.body,
		});

		return post.save();
	},
};

module.exports = { register, login, createPost };

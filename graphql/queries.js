const {GraphQLList, GraphQLID, GraphQLNonNull } = require('graphql');
const { UserType,PostType, CommentType } = require('./dataTypes');
const { User,Post, Comment } = require('../models');

const users = {
	type: new GraphQLList(UserType),
	description: 'Returns a list of users',
	resolve: async () => {
		return await User.find();
	},
};

const user = {
	type: UserType,
	description: 'Returns a user',
	args: {
		id: { type: GraphQLID },
	},
	resolve: async (_, args) => {
		const user = await User.findById(args.id);
		if (!user) throw new Error('Usuario no encontrado');
		console.log(user);
		return user;
	},
};

const posts = {
	type: new GraphQLList(PostType),
	description: 'retrieves a list of posts',
	resolve: () => Post.find(),
};

const post = {
	type: PostType,
	description: 'retrieves a single post',
	args: { id: { type: GraphQLID } },
	resolve: (_, { id }) => Post.findById(id),
};

const comments = {
	type: new GraphQLList(CommentType),
	description: 'Retrieves list of commnets',
	resolve: () => Comment.find(),
};

const comment = {
	type: CommentType,
	description: 'Retrieves a single comment',
	args: {
		id: { type: new GraphQLNonNull(GraphQLID) },
	},
	resolve: (_, { id }) => Comment.findById(id),
};
module.exports = {
	users,
	user,
	posts,
	post,
	comments,
	comment,
};

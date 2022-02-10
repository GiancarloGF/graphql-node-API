const { GraphQLString, GraphQLID, GraphQLNonNull } = require('graphql');
const { User, Post,Comment } = require('../models');
const { auth, bcrypt } = require('../util');
const { PostType, CommentType } = require("./dataTypes");

const register = {
	type: GraphQLString,
	description: 'Returns a string',
	args: {
		username: { type: new GraphQLNonNull(GraphQLString) },
		password: { type: new GraphQLNonNull(GraphQLString) },
		email: { type: new GraphQLNonNull(GraphQLString) },
		displayname: { type: new GraphQLNonNull(GraphQLString) },
	},
	resolve: async (_, args) => {
		const { username, password, email, displayname } = args;
		const user = new User({ username, email, password, displayname });
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
	resolve: async (_, { email, password }) => {
		const user = await User.findOne({ email: email });
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

		const userFound = await User.findById(verifiedUser.id);
		if (!userFound) throw new Error('Unauthorized');

		const post = new Post({
			authorId: verifiedUser.id,
			title: args.title,
			body: args.body,
		});

		return post.save();
	},
};
const updatePost = {
	type: PostType,
	description: 'update a blog post',
	args: {
		id: { type: new GraphQLNonNull(GraphQLID) },
		title: { type: new GraphQLNonNull(GraphQLString) },
		body: { type: new GraphQLNonNull(GraphQLString) },
	},
	async resolve(_, { id, title, body }, { verifiedUser }) {
		if (!verifiedUser) throw new Error('Unauthorized');

		const postUpdated = await Post.findOneAndUpdate(
			{ _id: id, authorId: verifiedUser.id },
			{ title, body },
			{
				new: true, // Return the new post updated instead of the old one.
				runValidators: true, // Force the update to run validators.
			}
		);

		if (!postUpdated) throw new Error('No post for given id');

		return postUpdated;
	},
};

const deletePost = {
	type: GraphQLString,
	description: 'Delete post',
	args: {
		postId: { type: new GraphQLNonNull(GraphQLID) },
	},
	async resolve(_, args, { verifiedUser }) {
		const postDeleted = await Post.findOneAndDelete({
			_id: args.postId,
			authorId: verifiedUser.id,
		});
		if (!postDeleted) throw new Error('No post with given ID Found for the author');

		return 'Post deleted';
	},
};

const addComment = {
	type: CommentType,
	description: 'Create a new comment for a blog post',
	args: {
		comment: { type: new GraphQLNonNull(GraphQLString) },
		postId: { type: new GraphQLNonNull(GraphQLID) },
	},
	resolve(_, { postId, comment }, { verifiedUser }) {
		const newComment = new Comment({
			userId: verifiedUser.id,
			postId,
			comment,
		});
		return newComment.save();
	},
};

const updateComment = {
	type: CommentType,
	description: 'update a comment',
	args: {
		id: { type: new GraphQLNonNull(GraphQLID) },
		comment: { type: new GraphQLNonNull(GraphQLString) },
	},
	async resolve(_, { id, comment }, { verifiedUser }) {
		if (!verifiedUser) throw new Error('UnAuthorized');

		const commentUpdated = await Comment.findOneAndUpdate(
			{
				_id: id,
				userId: verifiedUser.id,
			},
			{
				comment,
			},
			{
				new: true,
				runValidators: true,
			}
		);

		if (!commentUpdated) throw new Error('No comment with the given ID');

		return commentUpdated;
	},
};

const deleteComment = {
	type: GraphQLString,
	description: 'delete a comment',
	args: {
		id: { type: new GraphQLNonNull(GraphQLID) },
	},
	async resolve(_, { id }, { verifiedUser }) {
		if (!verifiedUser) throw new Error('Unauthorized');

		const commentDelete = await Comment.findOneAndDelete({
			_id: id,
			userId: verifiedUser.id,
		});

		if (!commentDelete) throw new Error('No comment with the given ID for the user');

		return 'Comment deleted';
	},
};

module.exports = {
	register,
	login,
	createPost,
	addComment,
	updatePost,
	deletePost,
	updateComment,
	deleteComment,
};

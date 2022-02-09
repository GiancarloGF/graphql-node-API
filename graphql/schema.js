const { users, user, posts, post, comments, comment } = require('./queries');
const { register, login, createPost, addComment, updatePost, deletePost, updateComment, deleteComment } = require('./mutations');
const { GraphQLSchema, GraphQLObjectType } = require('graphql');

const QueryType = new GraphQLObjectType({
	name: 'QueryType',
	description: 'The root query type',
	fields: {
		users,
		user,
		posts,
		post,
		comments,
		comment,
	},
});

const MutationType = new GraphQLObjectType({
	name: 'MutationType',
	description: 'The root mutation type',
	fields: {
		register,
		login,
		createPost,
		addComment,
		updatePost,
		deletePost,
		updateComment,
		deleteComment,
	},
});

module.exports = new GraphQLSchema({
	query: QueryType,
	mutation: MutationType,
});

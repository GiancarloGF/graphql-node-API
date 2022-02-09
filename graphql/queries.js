const { GraphQLList } = require('graphql');
const { UserType } = require('./dataTypes');
const { User } = require('../models');

const users = {
	type: new GraphQLList(UserType),
	description: 'Returns a list of users',
	resolve: async () => {
		return await User.find();
	},
};

module.exports = {
	users,
};

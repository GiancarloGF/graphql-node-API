const { GraphQLList, GraphQLString, GraphQLID } = require('graphql');
const { UserType } = require('./dataTypes');
const { User } = require('../models');

const users = {
	type: new GraphQLList(UserType),
	description: 'Returns a list of users',
	resolve: async () => {
		return await User.find();
	},
};

const user= {
	type: UserType,
	description: 'Returns a user',
	args: {
		id: { type: GraphQLID },
	},
	resolve: async (_, args) => {
		const user = await User.findById(args.id);
		if(!user) throw new Error('Usuario no encontrado');
		return user;
	}
}

module.exports = {
	users,
	user
};

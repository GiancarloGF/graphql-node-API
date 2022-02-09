const { GraphQLString, GraphQLID, GraphQLObjectType } = require('graphql');

const UserType = new GraphQLObjectType({
	name: 'UserType',
	description: 'The user data type',
	fields: {
		id: { type: GraphQLID },
		username: { type: GraphQLString },
		email: { type: GraphQLString },
		// password: { type: GraphQLString },
        displayname:{ type: GraphQLString},
        createdAt: { type: GraphQLString},
        updatedAt: { type: GraphQLString}
	},
});

module.exports = { UserType };

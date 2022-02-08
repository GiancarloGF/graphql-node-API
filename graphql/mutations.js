const { GraphQLString } = require('graphql');
const { User } = require('../models');

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
		const newUser = await User.create({
			username,
			password,
			email,
			displayname,
		});

		/* another way to create a new user in mongodb with mongoose:
        const newUser = new User({
            username,
            password,
            email,
            displayname,
        })
        const user = await newUser.save();
        console.log(user) 
        */

		console.log(newUser);
		return 'New user created';
	},
};

module.exports = { register };

const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');
const { connectDB } = require('./db');

connectDB();
const app = express();

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.use(
	'/graphql',
	graphqlHTTP({
		schema,
		graphiql: true,
	})
);

app.listen(3000, () => {
	console.log('Servidor corriendo en el puerto 3000...');
});

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const port = 8080;
const book = require('./app/routes/book');
const config = require('config');

const options = {
	server: {
		socketOptions: {
			keepAlive: 1,
			connectTimeoutMS: 30000
		},
	},
	replset: {
		socketOptions: {
			keepAlive: 1,
			connectTimeoutMS: 30000
		}
	}
};

mongoose.connect(config.DBHost, options);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


if (config.util.getEnv('NODE_ENV') !== 'test') {
	app.use(morgan('combined'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

app.get('/', (req, res) => {
	res.json({
		message: 'Welcome to our Bookstore'
	});
});

app.route('/book')
	.get(book.getBooks)
	.post(book.postBook)
app.route('/book/:id')
	.get(book.getBook)
	.delete(book.deleteBook)
	.put(book.updateBook);


app.listen(port);
console.log('listening on port ' + port);
module.exports = app; // for testing
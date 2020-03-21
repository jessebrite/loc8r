const mongoose = require('mongoose');
//Initialize MongoDB local
let dbURI = 'mongodb://localhost/loc8r';

 // If in production mode, set connection string to production DB
if (process.env.NODE_ENV  === 'production') {
	dbURI = process.env.MONGODB_URI;
}
// DB CONNECTION
mongoose.connect(dbURI, { useCreateIndex: true,
  useNewUrlParser: true, useUnifiedTopology: true });

// CONNECTION EVENTS
mongoose.connection.on('connected', () => {
	console.log('Mongoose connected');
});
mongoose.connection.on('error', err => {
	console.log(`Mongoose connection error: ${err}`);
});
mongoose.connection.on('disconnected', () => {
	console.log('Mongoose disconnected');
});

// CAPTURE APP TERMINATION/RESTART EVENT
const gracefulShutdown = (msg, callback) => {
	mongoose.connection.close( () => {
		console.log('Mongoose disconnected through ' + msg);
		callback();
	})
}

// nodemon restart
process.once('SIGUSR2', () => {
	gracefulShutdown('nodemon restart', () => {
		process.kill(process.pid, 'SIGUSR2');
	});
});

// App termination
process.on('SIGINT', () => {
	gracefulShutdown('app termination', () => {
		process.exit(0);
	});
});

// Heroku app termination
process.on('SIGTERM', () => {
	gracefulShutdown('Heroku app shutdown', () => {
		process.exit(0);
	});
});

require('./locations');
require('./users');
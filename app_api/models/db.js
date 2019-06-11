const mongoose = require('mongoose');
//Initialize MongoDB local
const dbURI = 'mongodb://localhost/loc8r';

 // If in production mode, set connection string to production DB
if (process.env.NODE_ENV  === 'production') {
	dbURI = process.env.MONGOdb_URL;
}
// DB CONNECTION
mongoose.connect(dbURI, { useNewUrlParser: true });

// CONNECTION EVENTS
mongoose.connection.on('connected', function () {
	console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error',function (err) {
	console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
	console.log('Mongoose disconnected');
});

// CAPTURE APP TERMINATION/RESTART EVENT
const gracefulShutdown = function (msg, callback) {
	mongoose.connection.close(function () {
		console.log('Mongoose disconnected through ' + msg);
		callback();
	})
}

// nodemon restart
process.once('SIGUSR2', function () {
	gracefulShutdown('nodemon restart', function () {
		process.kill(process.pid, 'SIGUSR2');
	});
});

// App termination
process.on('SIGINT', function () {
	gracefulShutdown('app termination', function () {
		process.exit(0);
	});
});

// Heroku app termination
process.on('SIGTERM', function () {
	gracefulShutdown('Heroku app shutdown', function () {
		process.exit(0);
	});
});

require('./locations');
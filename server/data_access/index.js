const mongoose = require('mongoose'),
	colors = require('colors');

async function initialSetup() {
	console.log(colors.bgGreen(colors.black('Doing initial site setups....')));
	console.log(colors.green('Site setup complete ✓'));
	console.log(colors.bgBlue(colors.cyan('Test server started successfully 👍')));
}

async function initMongooseConnection() {
    let conString = process.env.MONGO_URL;
	let mongooseConn = await mongoose.connect(conString);
	if (mongooseConn.connection) {
		initialSetup()
		return true
	}
	else {
		return new Error('Mongoose connection was unsuccessful');
	}
}

module.exports = {
	initMongooseConnection
}

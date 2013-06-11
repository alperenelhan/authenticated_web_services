var mysql = require('mysql');

exports.init = function (app) {
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'bbm488',
		password : 'bbm488',
		database : 'bbm488',
		multipleStatements : true
	});
	app.use(function (req, res, next) {
		req.db = connection;
		next();
	});
}
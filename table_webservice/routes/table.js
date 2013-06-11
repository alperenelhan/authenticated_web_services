var _ = require('underscore');
var mysql = require('mysql');
var convert = require('data2xml')();

function info (connection, callback) {
	var query = 'SELECT MIN(EXTRACT( YEAR FROM ( FROM_DAYS( DATEDIFF( NOW() , '+ mysql.escapeId("BirthDay") +
		') ) ) ) +0) As min, MAX(EXTRACT( YEAR FROM ( FROM_DAYS( DATEDIFF( NOW() , '+ mysql.escapeId("BirthDay") +
		') ) ) ) +0) As max, AVG(EXTRACT( YEAR FROM ( FROM_DAYS( DATEDIFF( NOW() , '+ mysql.escapeId("BirthDay") + ') ) ) ) +0) As avg from Personel';
	connection.query(query, function(err, rows) {
		connection.query("SELECT COUNT(*) from Personel", function (err, count) {
			connection.query("select * from Personel limit 1", function (err, results) {
				var data = rows[0];
				data.count = count[0]["COUNT(*)"];
				var fields = _.keys(results[0]);
				fields = _.without(fields, "id", "PID");
				callback(data, fields);
			});
		});
	});
}
exports.ops = function (req, res) {
	var connection = req.db;
	info(connection, function (data, fields) {
		res.render('table', { user: req.user, fields: fields, info: data, scripts: ['javascripts/jquery-animate.js', 'javascripts/bootstrap-min.js', 'javascripts/lib.js', 'javascripts/xml2js.js', 'javascripts/select2-min.js'] });
	});
}

exports.getInfo = function (req, res) {

	var connection = req.db;
	info(connection, function (data, fields) {
		var infoXML = convert("info", row_to_obj(data));
		res.send(infoXML);
	});
}

function row_to_obj (row) {
	return JSON.parse(JSON.stringify(row));
}
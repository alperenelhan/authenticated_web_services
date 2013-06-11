var _ = require('underscore');
var mysql = require('mysql');

exports.search = function (req, res) {
	var connection = req.db;
	var data = req.body.data.query;
	var query = "select * from Personel where " + data.trim();
	connection.query(query, function (err, rows) {
		res.send(rows);
	});

}

exports.update = function (req, res) {
	var connection = req.db;
	var person = req.body.person;
	var query="UPDATE Personel SET FirstName=" + mysql.escape(person.FirstName) + ",LastName=" + mysql.escape(person.LastName) + ","
                    + "Birthday=" + mysql.escape(person.Birthday) + ",Email=" + mysql.escape(person.Email) + ",Address=" + mysql.escape(person.Address) + ","
                    + "City=" + mysql.escape(person.City) + ",Province=" + mysql.escape(person.Province) + ",Country=" + mysql.escape(person.Country) + " where PID=" + person.PID;
	connection.query(query, function (err, rows) {
		res.send({
			success: true
		});
	});
}

exports.delete = function (req, res) {
	var connection = req.db;
	var pid = req.body.person.PID;
	var query = "DELETE FROM Personel WHERE PID=" + pid;
	connection.query(query, function (err, rows) {
		res.send({success: true});
	});
}

var mysql = require('mysql');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "MYSQL_PASS"
});

// Created the Connection
/*con.connect(function(err) {
if (err) throw err;
console.log("Connected!");
});*/

// Created the Database named as "gfg"
con.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");

	con.query("CREATE DATABASE world2",
		function (err, result) {
			if (err) throw err;
			console.log("Database created");
		});
});

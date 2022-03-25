var mysql = require('mysql');
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "MYSQL_PASS",
	database: "world"
});

con.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");

	// var sql = "CREATE TABLE
	// geeksforgeeks (name VARCHAR(255),
	// address VARCHAR(255))";

	// var sql = "ALTER TABLE
	// geeksforgeeks ADD COLUMN id INT
	// AUTO_INCREMENT PRIMARY KEY";

	var sql1 = "CREATE TABLE geeksforgeeks "
		+ "(id INT AUTO_INCREMENT PRIMARY KEY," +
		" name VARCHAR(255), address VARCHAR(255))";

	var sql2 = "INSERT INTO geeksforgeeks (name, "
		+ "address) VALUES ('Company Inc', "
		+ "'Highway 37')";

	var sql3 = "SELECT * FROM geeksforgeeks "
		+ "WHERE address = 'Highway 37'";

	con.query(sql1, function (err, result) {
		if (err) throw err;
		console.log("Table created");
	});

	con.query(sql2, function (err, result) {
		if (err) throw err;
		console.log("Insertion Successful");
	});

	con.query(sql3, function (err, result) {
		if (err) throw err;
		console.log(result);
	});
});

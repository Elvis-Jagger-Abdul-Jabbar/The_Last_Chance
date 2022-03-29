module.exports = {
  hello: function(){
    return 'Hello';
  }
}
const { query } = require('express');
const express = require('express');
const app = express();

// Require pug and pug folder
app.engine('pug', require('pug').__express)
app.set('views', './views')
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));


// Listen to port
const server = app.listen(7000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

// Mysql
var mysql = require('mysql');

// Mysql connection parameters
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MYSQL_PASS',
    database: 'world'
});

// Connect to Mysql
connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    console.log("Connected to Mysql");
    // Create database
    connection.query("CREATE DATABASE IF NOT EXISTS world",
      function (err, result){
        if (err) throw err;
        console.log("Database created or already exisiting");
      })
  });

  // Variables for mysql-import
  const host = 'localhost';
  const user = 'root';  
  const password = 'MYSQL_PASS';
  const database = 'world';

  const Importer = require('mysql-import');
  const importer = new Importer({host, user, password, database});
  
  // Shopw inport progress
  importer.onProgress(progress=>{
    var percent = Math.floor(progress.bytes_processed / progress.total_bytes * 10000) / 100;
    console.log(`${percent}% Completed`);
  });


    
  // Import world.sql
  console.log('Importing SQL file.')
  importer.import('./world-db/world.sql').then(()=>{
    var files_imported = importer.getImported();
    console.log(`${files_imported.length} SQL file(s) imported.`);
  }).catch(err=>{
    console.error(err);
  });

// Search for country
search = () => {
let fetchedData = [];
let name = process.argv[2];
let database = 'world'
let sql = `SELECT population FROM country WHERE name =` + mysql.escape(name);
connection.query(sql, (error, results, fields) => {
  if (error) {
    return console.error(error.message);
  }
    var string=JSON.stringify(results);
    var json =  JSON.parse(string);    
    fetchedData = json[0].results;
    return fetchedData;
});
};

// Mainpage get
app.get('/', (req, res) => {
  res.render('index', {
    title: 'World Population',
  });
});

// Couontries get, query all from database
app.get('/data', function (req, res) {
let fetchedData = [];
let sql = `SELECT * FROM country`;
connection.query(sql, (error, countries, fields) => {
  if (error) {
    return console.error(error.message);
  }
    // string json and return database to front end
    var string = JSON.stringify(countries);
    var json =  JSON.parse(string);
    //console.log(json);
    res.render('data', {
      title: 'Countries - All Data',
      json,
    });
  });

// Country get, query all from database
app.get('/countries', function (req, res) {
  let fetchedData = [];
  let sql = `SELECT * FROM country`;
  connection.query(sql, (error, countries, fields) => {
    if (error) {
      return console.error(error.message);
    }
      // string json and return database to front end
      var string = JSON.stringify(countries);
      var json =  JSON.parse(string);
      //console.log(json);
      res.render('countries', {
        title: 'Countries, Population sorter',
        json,
      });
    });
  });
 
// Query continent: Africa
app.get('/africa', function (req, res){
  let sql = `SELECT * FROM country where continent = 'Africa'`;
  connection.query(sql, (error, countries, fields) => {
    if (error) {
      return console.error(error.message);
    }
      // string json and return database to front end
      var string = JSON.stringify(countries);
      var json =  JSON.parse(string);
      //console.log(json);
      res.render('africa', {
        title: 'Africa, Population sorter',
        json,  
      });
    });
  });

  // Query continent: Asia
app.get('/europe', function (req, res){
  let sql = `SELECT * FROM country where continent = 'Europe'`;
  connection.query(sql, (error, countries, fields) => {
    if (error) {
      return console.error(error.message);
    }
      // string json and return database to front end
      var string = JSON.stringify(countries);
      var json =  JSON.parse(string);
      //console.log(json);
      res.render('europe', {
        title: 'Europe, Population sorter',
        json,  
      });
    });
  });


  // Sorter page to test all data in one page
app.get('/sorter', function (req, res) {
  let fetchedData = [];
  let sql = `SELECT continent as continent, 
    SUM(population) as population
    FROM country
    GROUP BY continent `;
  connection.query(sql, (error, countries, fields) => {
    if (error) {
      return console.error(error.message);
    }
      // string json and return database to front end
      var string = JSON.stringify(countries);
      var json =  JSON.parse(string);
      console.log(json);
      //console.log(json);
      res.render('sorter', {
        title: 'Sorter',
        json,
      });
    });
  });


});

module.exports = server;
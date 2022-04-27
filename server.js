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
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'MYSQL_PASS',
    database: 'world'
});

// Connect to Mysql
pool.getConnection(function(err, connection) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    console.log("Connected to Mysql");
    // Create database
    pool.query("CREATE DATABASE IF NOT EXISTS world",
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

// Main page routing to Index
app.get('/', (req, res) => {
  res.render('index', {
    title: 'World Population',
  });
});

// Countries route
// Query all from country table where capital = capital from city table
app.get('/countries', function (req, res) {
let fetchedData = [];
let sql = `SELECT c.*, s.Name as 'Capital' 
          FROM country c, city s
          WHERE c.Capital = s.ID`
pool.query(sql, (error, countries, fields) => {
  if (error) {
    return console.error(error.message);
  }
    // string json and return database to front end
    var string = JSON.stringify(countries);
    var json =  JSON.parse(string);
    console.log('Countries json sent with ' + json.length + ' lines. Below a sample:');
    console.log(json[15]);
    res.render('countries', {
      title: 'Countries Population',
      json,
    });
  });
});

// Cities route
app.get('/cities', function (req, res) {
  let fetchedData = [];
  let sql = `SELECT c.*, s.Name as 'Country' 
            FROM city c, country s
            WHERE c.CountryCode = s.Code`;
  pool.query(sql, (error, countries, fields) => {
    if (error) {
      return console.error(error.message);
    }
      // string json and return database to front end
      var string = JSON.stringify(countries);
      var json =  JSON.parse(string);
      console.log('Cities json sent with ' + json.length + ' lines. Below a sample:');
      console.log(json[17]);
      res.render('cities', {
        title: 'Cities Population',
        json,
      });
    });
  });
 
// capitals route
app.get('/capitals', function (req, res) {
  let fetchedData = [];
  let sql = `SELECT s.*, c.Name as Country, c.Capital as 'Capital' 
            FROM city s, country c
            WHERE c.Capital = s.ID`;
  pool.query(sql, (error, countries, fields) => {
    if (error) {
      return console.error(error.message);
    }
      // string json and return database to front end
      var string = JSON.stringify(countries);
      var json =  JSON.parse(string);
      console.log('Capitals json sent with ' + json.length + ' lines. Below a sample:');
      console.log(json[21]);
      res.render('capitals', {
        title: 'Capitals Population',
        json,
      });
    });
  });

// People route
app.get('/people', function (req, res) {
  let fetchedData = [];
  let sql = `SELECT c.Continent, c.Region, c.Name as 'Country', c.Population,
              round(sum(s.population)/c.Population *100 , 2) as 'Urban',
              round((c.Population - sum(s.Population))/c.Population *100 , 2) as 'NonUrban'
              from city s, country c
              where s.CountryCode = c.Code
              group by s.CountryCode`
  pool.query(sql, (error, countries, fields) => {
    if (error) {
      return console.error(error.message);
    }
      // string json and return database to front end
      var string = JSON.stringify(countries);
      var json =  JSON.parse(string);
      console.log('People json sent with ' + json.length + ' lines. Below a sample:');
      console.log(json[18]);
      res.render('people', {
        title: 'Population Report',
        json,
      });
    });
  });

// Langaue route
app.get('/language', function (req, res) {
  let fetchedData = [];
  let sql = `select l.language, round(sum((l.Percentage * c.Population)/100)) as 'Speakers',
        round((sum((l.Percentage * c.Population)/100))/(select sum(population) from country) *100, 2) as 'Percent', c.Name
        from countrylanguage l, country c
        where l.CountryCode = c.Code
        group by l.Language`
  pool.query(sql, (error, countries, fields) => {
    if (error) {
      return console.error(error.message);
    }
      // string json and return database to front end
      var string = JSON.stringify(countries);
      var json =  JSON.parse(string);
      console.log('Language json sent with ' + json.length + ' lines. Below a sample:');
      console.log(json[45]);
      res.render('language', {
        title: 'Languages Report',
        json,
      });
    });
  });


// About route
app.get('/login', function (req, res) {
  
      res.render('login', {
        title: 'Login'
      });
    });
  

  // Sorter page to test all data in one page
app.get('/sorter', function (req, res) {
  let fetchedData = [];
  let sql = `SELECT continent as continent, 
    SUM(population) as population
    FROM country
    GROUP BY continent `;
  pool.query(sql, (error, countries, fields) => {
    if (error) {
      return console.error(error.message);
    }
      // string json and return database to front end
      var string = JSON.stringify(countries);
      var json =  JSON.parse(string);
      //console.log(json);
      //console.log(json);
      res.render('sorter', {
        title: 'Sorter',
        json,
      });
    });
  });



module.exports = server;
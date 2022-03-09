const { query } = require('express');
const express = require('express');
const app = express();

app.engine('pug', require('pug').__express)
app.set('views', './views')
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

const server = app.listen(7000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

let mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MYSQL_PASS',
    database: 'world'
});

// Connect
connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    console.log("Connected to Mysql")
  });

search = () => {
let fetchedData = [];
let name = process.argv[2];
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

app.get('/', (req, res) => {
  res.render('index', {
    title: 'World Population',
  });
});


app.get('/countries', function (req, res) {
let fetchedData = [];
let sql = `SELECT * FROM country`;
connection.query(sql, (error, countries, fields) => {
  if (error) {
    return console.error(error.message);
  }
    var string = JSON.stringify(countries);
    var json =  JSON.parse(string);
    console.log(json);
    res.render('countries', {
      title: 'Countries',
      json,
      
    });    
    
  });
  
});

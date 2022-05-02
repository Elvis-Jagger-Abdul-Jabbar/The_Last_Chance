const express = require('express');
const app = express();
//const { User } = require("/models/user");
const pool = require('./services/db');
// Require pug and pug folder
app.engine('pug', require('pug').__express)
app.set('views', './views')
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));


// Listen to port
const server = app.listen(7000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
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
let sql = `SELECT c.*, s.Name as 'Capital' 
          FROM country c, city s
          WHERE c.Capital = s.ID`;
          pool.query(sql).then(countries => {
            // string json and return database to front end
            var string = JSON.stringify(countries);
            var json =  JSON.parse(string);
            console.log('Cities json sent with ' + json.length + ' lines. Below a sample:');
            console.log(json[17]);
            res.render('countries', {
              title: 'Countries Population',
              json,
      });
  });
});

// Cities route
app.get('/cities', function (req, res) {
  let sql = `SELECT c.*, s.Name as 'Country' 
            FROM city c, country s
            WHERE c.CountryCode = s.Code`;
  pool.query(sql).then(cities => {
      // string json and return database to front end
      var string = JSON.stringify(cities);
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
  let sql = `SELECT s.*, c.Name as Country, c.Capital as 'Capital' 
            FROM city s, country c
            WHERE c.Capital = s.ID`;
  pool.query(sql).then(capitals => {
      // string json and return database to front end
      var string = JSON.stringify(capitals);
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
  let sql = `SELECT c.Continent, c.Region, c.Name as 'Country', c.Population,
              round(sum(s.population)/c.Population *100 , 2) as 'Urban',
              round((c.Population - sum(s.Population))/c.Population *100 , 2) as 'NonUrban'
              from city s, country c
              where s.CountryCode = c.Code
              group by s.CountryCode`
  pool.query(sql).then(people => {
      // string json and return database to front end
      var string = JSON.stringify(people);
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
// Run below code in mysql or phpMyadmin to avoid error message in Group BY
// SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
app.get('/language', function (req, res) {
  let sql = `select l.language, round(sum((l.Percentage * c.Population)/100)) as 'Speakers',
        round((sum((l.Percentage * c.Population)/100))/(select sum(population) from country) *100, 2) as 'Percent', c.Name
        from countrylanguage l, country c
        where l.CountryCode = c.Code
        group by l.Language`
  pool.query(sql).then(languages => {
      // string json and return database to front end
      var string = JSON.stringify(languages);
      var json =  JSON.parse(string);
      console.log('Language json sent with ' + json.length + ' lines. Below a sample:');
      console.log(json[45]);
      res.render('language', {
        title: 'Languages Report',
        json,
      });
    });
  });


// Register
app.get('/register', function (req, res) {
  res.render('register');
  });
  // Login
  app.get('/login', function (req, res) {
  res.render('login');
  });
  
  app.post('/set-password', function (req, res) {
    params = req.body;
    var user = new User(params.email);
    try {
    user.getIdFromEmail().then( uId => {
    if(uId) {
    // If a valid, existing user is found, set the password and redirec
    user.setUserPassword(params.password).then ( result => {
    res.redirect('/single-student/' + uId);
    });
    }
    else {
    // If no existing user is found, add a new one
    user.addUser(params.email).then( Promise => {
    res.send('Perhaps a page where a new user sets a programme would')
    });
    }
    })
    } catch (err) {
    console.error(`Error while adding password `, err.message);
    }
    });
    // Check submitted email and password pair
    app.post('/authenticate', function (req, res) {
    params = req.body;
    var user = new User(params.email);
    try {
    user.getIdFromEmail().then(uId => {
    if (uId) {
    user.authenticate(params.password).then(match => {
    if (match) {
    // Set the session for this user
    req.session.uid = uId;
    req.session.loggedIn = true;
    res.redirect('/single-student/' + uId);
    }
    else {
    // TODO improve the user journey here
    res.send('invalid password');
    }
    });
    }
    else {
    res.send('invalid email');
    }
    })
    } catch (err) {
    console.error(`Error while comparing `, err.message);
    }
    });
      // Set the sessions
var session = require('express-session');
app.use(session({
secret: 'secretkeysdfjsflyoifasd',
resave: false,
saveUninitialized: true,
cookie: { secure: false }
}));


// Create a route for root - /
app.get("/admin", function(req, res) {
  console.log(req.session);
  if (req.session.uid) {
  res.send('Welcome back, ' + req.session.uid + '!');
  } else {
  res.send('Please login to view this page!');
  }
  res.end();
  });

  // Logout
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/login');
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
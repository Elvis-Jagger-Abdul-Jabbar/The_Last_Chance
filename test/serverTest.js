var mysql = require('mysql');
const Importer = require('mysql-import');

const request = require('supertest');
const server = require('../server')

const host = 'localhost';
const user = 'root';  
const password = 'MYSQL_PASS';
const database = 'world';

// Test connection to Mysql
describe('Connect to Mysql', function(){    
         it('Should pass', function(done){
             var connection = mysql.createConnection({
                 host: host,
                 user: user,
                 password: password,
                 database: database,
             });
             connection.connect(done);
     })
 });
// Test failed connection
//describe('Connect to Mysql', function(){    
//    it('Should fail: Error: ER_ACCESS_DENIED_ERROR: Access denied for user', function(done){
//        var connection = mysql.createConnection({
//           host: host,
//            user: user,
//            password: 'wrong password',
//            database: database,
//        });
//        connection.connect(done);
//   })
//});

// Test onProgress
// Commenting this for circelci test
//describe('Import progress', function(){    
//    it('Testing import progress, should say unknwon database ', function(){
//        const importer = new Importer({host, user, password, database});
//        importer.onProgress(progress=>{
//        var percent = Math.floor(progress.bytes_processed / progress.total_bytes * 10000) / 100;
//        console.log(`${percent}% Completed`);
//        });
//        importer.onProgress();
//    });
//});

// Test app.get
describe('Get /', function() {
    it('Main page', function(done) {
        request(server)
        .get('/')
        .expect(200, done);
    });
});

// Test app.get
//describe('Get /data', function() {
//    it('Data page', function(done) {
//        request(server)
//        .get('/data')
//        .expect(200, done);
//    });
//});
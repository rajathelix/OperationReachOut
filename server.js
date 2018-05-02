/*var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "hello",
  database: "mysql"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "INSERT INTO users (id, title) VALUES (2, 'Highway')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("table created");
  });
})

var express    = require("express");
 var mysql      = require('mysql');
 var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : 'hello',
   database : 'mysql'
 });
 var app = express();
 
 connection.connect(function(err){
 if(!err) {
     console.log("Database is connected ... \n\n");  
 } else {
     console.log("Error connecting database ... \n\n");  
 }
 });*/
var express    = require("express");
var login = require('./routes/loginroutes');
var bodyParser = require('body-parser');
var fs = require("fs");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'hello',
  database : 'mysql'
});
connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");
} else {
    console.log("Error connecting database ... nn");
}
});
app.post('/register', function(req, res, next) {
  var cope = req.body;
  console.log('Registration request received:', req.body);
 var query = connection.query('insert into users set ?', cope, function (err,     result) {
  if (err) {
      console.error(err);
      return res.send(err);
  } else {
      return res.send('Ok');
      
  }
  });
  //res.send('received the data.');
});
app.post('/loginuser', function(req, res, next){
  var email= req.body.email;
  var password = req.body.password;
  console.log('Login request received:', req.body);
  connection.query('SELECT * FROM users WHERE email = ?',[email], function (err, results, fields) {
  if (err) {
    console.log("error ocurred",err);
    return res.send(err);
  }else{
    if(results.length >0){
      if(results[0].password == password){
        console.log('The solution is: ', results);
        return res.send('Ok'+' '+results[0].fname);
      }
      else{
        console.log("wrong pasword");
        return res.send('EPDM');
      }
    }
    else{
      console.log("email not in database");
      return res.send('EDNE');
    }
  }
  });
});

app.listen(8080);
/*var router = express.Router();

// test route
router.get('/', function(req, res) {
    res.json({ message: 'welcome to our upload module apis' });
});

//route to handle user registration
router.post('/register',login.register);
router.post('/login',login.login)
app.use('/api', router);
app.listen(5000);*/
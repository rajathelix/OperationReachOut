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

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var router = express.Router();

// test route
router.get('/', function(req, res) {
    res.json({ message: 'welcome to our upload module apis' });
});

//route to handle user registration
router.post('/register',login.register);
router.post('/login',login.login)
app.use('/api', router);
app.listen(5000);
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
  var cope_obj = req.body;
  console.log('Registration request received:', req.body);
 var query = connection.query('insert into users set ?', cope_obj, function (err,     result) {
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
  var email_str= req.body.email;
  var password_str = req.body.password;
  console.log('Login request received:', req.body);
  connection.query('SELECT * FROM users WHERE email = ?',[email_str], function (err, results, fields) {
  if (err) {
    console.log("error ocurred",err);
    return res.send(err);
  }else{
    if(results.length >0){
      if(results[0].password == password_str){
        console.log('The solution is: ', results);
        return res.send(results[0]);
        //return res.send('Ok'+' '+results[0].actype+' '+results[0].fname+' '+results[0].email+' '+results[0].mobileno);
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

app.post('/registercheck', function(req, res, next){
  var email_str= req.body.email;
  var mb_number = req.body.mobileno;
  console.log('Checking email and phone for new Registration', req.body);
  var a = connection.query('SELECT * FROM users WHERE email = ?',[email_str], function (err, results, fields) {
    if(err){
      console.error('err1');
      return res.send(err);
    }
    else {
      if(results.length >0){
        var b = connection.query('SELECT * FROM users WHERE mobileno = ?',[mb_number], function (err, results, fields) {
          if(err){
            console.error('err2');
            return res.send(err);
          }
          else {
            if(results.length >0){
              return res.send("dmde");
            }
            else { 
              return res.send("de");
            }
          }
        });
      }
      else {
        var c = connection.query('SELECT * FROM users WHERE mobileno = ?',[mb_number], function (err, results, fields) {
          if(err){
            console.error('err3');
            return res.send(err);
          }
          else {
            if(results.length >0){
              return res.send("dm");
            }
            else { 
              return res.send("ok");
            }
          }
        });
      }
    }
  });
});
app.get('/getques', function(req, res, next){
  connection.query("SELECT * from ques",function(err, results, fields){
    if(err){
      return res.send(err);
    }
    else {
      return res.send(results);
    }
  });
});
app.post('/quizcheck', function(req, res, next){
  console.log("quiz home current status");
  var e_str = req.body.email;
  connection.query('SELECT * FROM tquiz WHERE email = ?',[e_str], function (err, results, fields) {
    if (err) {
      console.log("error ocurred",err);
      return res.send(err);
    }else{
      if(results.length >0){
        console.log('The solution is: ', results[0]);
        return res.send(results[0]);
      }
      else{
        console.log("Quiz not attempted yet");
        return res.send('no');
      }
    }
    });
});
app.post('/qr', function(req, res, next){
  console.log("quiz update status");
  var e_str = req.body.email;
  var r_str = req.body.result;
  if(r_str == "nd"){
    req.body.s1 = "No Depression.";
    req.body.s2 = "You do not need any treatment.";
  }
  else if(r_str == "md"){
    req.body.s1 = "Moderate Depression.";
    req.body.s2 = "You can consult Counsellor to make sure you are fine.";
  }
  else if(r_str == "sd"){
    req.body.s1 = "Severe Depression.";
    req.body.s2 = "You must immediately consult a Counsellor and take part in activity.";
  }
  var cope_obj = req.body;
  var a_str = req.body.s1;
  var b_str = req.body.s2;
  connection.query('SELECT * FROM tquiz WHERE email = ?',[e_str], function (err, results, fields) {
    if (err) {
      console.log("error ocurred",err);
      return res.send(err);
    }else{
      if(results.length >0){
          connection.query('UPDATE tquiz set result = ?, s1 = ?, s2 = ? where email = ? ',[r_str,a_str,b_str,e_str], function (err,results) {
          if (err) {
            console.error('err1');
            return res.send(err);
          } else {
            return res.send('update');    
          }
        });
        /*console.log('update failed');
        return res.send('update');*/
      }
      else{
        connection.query('insert into tquiz set ?', cope_obj, function (err, result) {
          if (err) {
            console.error('err2');
            return res.send(err);
          } else {
            return res.send('insert');    
          }
        });
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
app.listen(5000);
*/
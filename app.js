require ("dotenv").config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const viewpost = require('./Controllers/post');
const authviewpost = require('./Controllers/postCrud');
const { checkToken } = require('./_helpers/token_validation');
// router file

const app = express(); 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/',(req,res)=>{
  res.send("Hello Word");
})

//login start
app.use('/users', require('./users/users.controller'));
// login end

// app.use('/', checkToken, viewpost);
app.use('/',  viewpost);
app.use('/', authviewpost);
app.use('/filename', express.static('./upload/images'));
app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }));

app.use((req, res, next) => {
    res.header({"Access-Control-Allow-Origin": "*"});
    next();
})
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404));
//   });

  // // error handler
  // app.use(function(err, req, res, next) {
  //   // set locals, only providing error in development
  //   res.locals.message = err.message;
  //   res.locals.error = req.app.get('env') === 'development' ? err : {};

  //   // render the error page
  //   res.status(err.status || 500);
  //   res.render('error');
  // });

app.listen(3306, () => {
    console.log("Server up and running", process.env.APP_PORT);
})

module.exports = app;

console.log("-----------------------------------------------------------------")

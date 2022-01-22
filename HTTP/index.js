var http = require('http');
const express = require('express');
var logger = require('morgan');

var path = require('path');
var cookieParser = require('cookie-parser');
var router = require('./routes/router');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/public", express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', './views');

app.use('/', router);

app.all('*', function( req, res, next) {
    res.redirect('/error');
  });

var server = http.createServer(app);
server.listen(7000,'0.0.0.0');


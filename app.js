var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var socket_io = require('socket.io');
var debug = require('debug')('myapp:server');
var http = require('http');


var mongoose = require('mongoose');
var db = require('./model/db');
var User = require('./model/models').user;
var Message = require('./model/models').message;

var app = express();

var io = socket_io();
app.io = io;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', function(client){
  console.log("Client connected..");
  client.on('join', function(data){
    console.log(data);
  });

  client.on('new user', function(data){
    console.log("New user"+data.nickname);
    User.findOne({'nickname': data.nickname}, function(err, result){
      if(err){
        throw err;
      }

      if(result){

        User.findOneAndUpdate({nickname:data.nickname},{$set:{socketid:client.id}}, function(err, doc){
          if(err) throw err;

          console.log("Güncelleme basarılı");
        });

      }else{
        var newUser = new User({nickname:data.nickname, socketid:client.id});

        newUser.save(function(err){
          if(err) throw err;
          console.log("Kisi kaydedildi");
        })
      }
    });
  });

  client.on('send message', function(data){
        var newMsg = new Message({sender:data.nickname, message:data.message});
        console.log("New message= "+data.message);

        newMsg.save(function(err, docs){
            if(err) throw err;
            console.log(docs.sender);
            io.emit('new message', {nickname:docs.sender, message:docs.message, created:docs.created});
        })
  });
});


app.get('/', function(req, res, next) {
    res.render('login', { title: 'Express' });
});
app.post('/login', function(req, res, next) {
    res.render("index");
});
app.get('/index', function(req, res, next) {
    User.find({}, function(err, result){
        if(err) throw err;

        res.send(result);
    });


});

/* Kullanıcıyı ada göre getir. */
app.get('/:name', function(req, res, next){
    User.findOne({nickname:req.params.name}, function(err, result){
        if(err) throw err;

        if(!result){
            res.status(404).send('Boyle bir kullanici bulunmamaktadir.');
        }else{
            res.send(result);
        }
    });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * Module dependencies.
 */



/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

var io = app.io;
io.attach(server);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}


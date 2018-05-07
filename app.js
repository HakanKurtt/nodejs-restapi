var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('noderestapi:server');
var socket_io=require('socket.io');
var http = require('http');
var request = require('request');
var cors = require('cors')

var app = express();
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/node_modules'));

var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
var io =socket_io(server);
var nickname ;
var gdata;
io.on('connection', function(client) {
    console.log("Client connected..");
    client.on('join', function (data) {
        console.log(data);
    });
    io.emit('new user',nickname);
    client.on('new user', function (data) {
        console.log("New user" + data.nickname);
    });
    client.on('send message', function (data) {
        console.log("New message= " + data.message);
        request({url: "http://localhost:4000/messages/", method: 'POST', json: data},
            function (err, response, body) {
                if (err) console.log(err);
                console.log(JSON.stringify(body)+"merhaba"+client.id);
                    io.to(client.id).emit('new message', body);
            });

    });
});
app.get('/', function(req, res, next) {
    res.render('login');
});
app.get('/register',function (req,res,next) {
    res.render('register');
});
app.get('/index', function(req, res, next) {
    res.render("index",{data:gdata});

});
app.post('/users',function (req,res,next) {
    console.log(req.body);
    kullanicivarmi(req.body.search,function (callback) {
        if(callback!="1"){
            request('http://localhost:4000/messages/'+callback.nickname, function (error, response, body) {
                let data = JSON.parse(body);
                console.log(JSON.stringify(data));
                console.log(JSON.stringify(callback)+"selamsana");
                res.render("index",{data:callback,messages:data});
            });
        }
    });
});
app.post('/login', function(req, res, next) {
    console.log(req.body.token);
    kullanicivarmi(req.body.token,function (callback) {
        if(callback!="1"){
            request('http://localhost:4000/messages/'+callback.nickname, function (error, response, body) {
                let data = JSON.parse(body);
                console.log(JSON.stringify(data));
                console.log(JSON.stringify(callback)+"selamsana");
                res.render("index",{data:callback,messages:data});
            });
        }
        else
            res.send('Böyle bir kullanıcı yok');
    });
        nickname=req.body.token;
});
app.post('/newregister',function (req,res,next) {
            console.log(req.body);
            request({ url: "http://localhost:4000/users/", method: 'POST', json: req.body},
                function(err, response , body){
                    console.log(body)
                    res.render("index",{data:req.body});
                });

    });
function kullanicivarmi(name,callback){
    request('http://localhost:4000/users/'+name, function (error, response, body) {
        var data = JSON.parse(body);
        console.log(JSON.stringify(data));
        callback(data);
    });

};

app.use(function(req, res, next) {
    next(createError(404));
});
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

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
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

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
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}


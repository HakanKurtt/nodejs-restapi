const express = require('express'),
      users = require('./routes/users'),
      messages = require('./routes/messages');

const Joi = require('joi');
const app = express();

var logger = require('morgan');

var db = require('./model/db');




//middleware
app.use(express.json());
app.use('/users', users);
app.use('/messages', messages);

app.use(logger('dev'));


const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`${port} portundan dinleniyor..`));
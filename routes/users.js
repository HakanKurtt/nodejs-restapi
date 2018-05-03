var express = require('express');
var router = express.Router();
var app = express();

var db = require('../model/db');
var User = require('../model/models').user;

var Joi = require('joi');

app.use(express.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}, function(err, result){
    if(err) throw err;

    res.send(result);
  });


});

/* Kullanıcıyı ada göre getir. */
router.get('/:name', function(req, res, next){
  User.findOne({nickname:req.params.name}, function(err, result){
    if(err) throw err;

    if(!result){
      res.status(404).send('Boyle bir kullanici bulunmamaktadir.');
    }else{
      res.send(result);
    }
  });
});

module.exports = router;

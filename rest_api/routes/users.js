var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

var router = express.Router();
const app = express();

const Joi = require('joi');



var User = require('../model/models').user;


// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use(express.json());
app.use(logger('dev'));

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
            res.send('1');
        }else{
            res.send(result);
        }
    });
});

router.post('/', function(req, res, next){

    User.findOne({nickname:req.body.nickname}, function(err, result){
        if(err) throw err;

        if(result){
            console.log("kullanıcı var");
            res.send('1'); //Kullanıcı kayıtlıysa 1 gönder.

        }else{//yeni kullanıcı kaydedilecek.
            var newUser = new User({nickname:req.body.nickname, name:req.body.name, surname:req.body.surname});
            console.log("kullanıcı yok");
            newUser.save(function(err){
                if(err) throw err;

                res.send("Kullanıcı kaydedildi.");
            });


        }
    });

});

router.put('/:nickname',function(req, res, next){
    User.findOne({nickname:req.params.nickname}, function(err, result){
        if(err) throw err;

        if(result){

            User.update({nickname: req.body.nickname},{$set:{name:req.body.name, surname:req.body.surname}}, function(err, result){
                if(err) throw err;

                res.send(result);
            });




        }else{//yeni kullanıcı kaydedilecek.

            res.send('Gecersiz islem');


        }
    });
});

router.delete('/:nickname', function(req, res, next){
    User.findOneAndRemove(req.params.nickname, function(err, result){
        if(err) return res.status(500).send(err);

        res.send("Kullanıcı silindi!");
    });
});

module.exports = router;
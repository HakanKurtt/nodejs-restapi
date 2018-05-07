var express = require('express');
var bodyParser = require('body-parser');

var router = express.Router();
const app = express();

const Joi = require('joi');

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse requests of content-type - application/json
app.use(bodyParser.json());

var Message = require('../model/models').message;

app.use(express.json());

/* GET messages. */
router.get('/', function(req, res, next) {
    Message.find({}, function(err, result){
        if(err) throw err;

        res.send(result);
    });


});

/* Mesajları getir. */
router.get('/:nickname', function(req, res, next){
    Message.find({sender:req.params.nickname}, function(err, result){
        if(err) throw err;

        if(!result){
            res.status(404).send('Boyle bir mesaj bulunmamaktadir.');
        }else{
            res.send(result);
        }
    });
});

router.post('/', function(req, res, next){

    var newMsg = Message({sender:req.body.nickname, message:req.body.message});

    newMsg.save(function(err, result){
       if(err) throw err;

       res.send(result);
    });


});

router.put('/:id', function(req, res, next){
    console.log(req.params.id);
    console.log(req.body.message);
    Message.update({_id: req.params.id},{$set:{message:req.body.message}}, function(err, result){
       if(err) res.status(500).send(err);

       if(result){
           res.send(result);
       }else{
           res.send("Bir hata olustu");
       }
    });
});

router.delete('/:id', function(req, res, next){
    Message.findByIdAndRemove(req.params.id, function(err, result){
        if(err) res.status(500).send(err);

        res.send(result);
    });
});



module.exports = router;
var express = require('express');
var router = express.Router();
var path = require('path');
var app = express();


/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
    res.sendfile(path.join('./views/index.html'));
});

module.exports = router;

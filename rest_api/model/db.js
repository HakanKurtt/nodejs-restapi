var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myapp', function(err){
    if(err){
        console.log(err);
    }else {
        console.log('Connected to db.');
    }
});
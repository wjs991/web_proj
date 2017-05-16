var express = require('express');
var router = express.Router();
var mongoose= require('mongoose');
var Person=require('../db/dbScheme.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.cookies['auth']=="true"){
        res.send("<h1>자동 로그인 10분동안</h1>");
    }

    res.render('login');
});

router.post('/', function(req, res, next){
    mongoose.connect('mongodb://seeho:seeho123@ds133271.mlab.com:33271/proj_pp');
    var db=mongoose.connection;

    db.on('error', function(error){
        console.log("DB error: ",err);
    })
    db.once('open', function() {
        console.log("DB success");
        Person.find({'id':req.body.id} , function(err, person) {
            if (err) return res.json(err);

            if(!person){
                res.redirect("./login")
            }
            else {
                res.cookie('auth', 'true', {
                    expires: new Date(Date.now() + 1000 * 60 * 10)
                });
                res.send(person);
            }
        });
    });
});

module.exports = router;


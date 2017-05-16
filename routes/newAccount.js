var express = require('express');
var router = express.Router();
var mongoose= require('mongoose');
var Person=require('../db/dbScheme.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('form');
});

router.post('/', function(req, res, next) {
    mongoose.connect('mongodb://seeho:seeho123@ds133271.mlab.com:33271/proj_pp')
    db=mongoose.connection;

    db.on('error', function(error){
        console.log("DB error: ",err);
    });
    db.once('open', function () {
        console.log("open");

        var insertPerson = new Person({
            id: req.body.id,
            pw: req.body.pw,
            nickName: req.body.nickName,
            name: req.body.name,
            gender: req.body.gender,
            email: req.body.email,
            phNum: req.body.phNum
        });

        insertPerson.save(function (err, silence) {
            if (err) {
                console.err(err);
                throw err;
            }

            res.redirect("/login");


        });
    });
});


module.exports = router;

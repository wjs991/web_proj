var express = require('express');
var router = express.Router();
var Person= require('../model/dbScheme.js');


router.get("/new", function(req, res){
    res.render("users/new", {Person:{}});
});
router.route("/").get(function(req, res){
    Person.find({})
        .sort({name:1})
        .exec(function(err, users){
            if(err) return res.json(err);
            res.render("login", {users:users});
        });
});

// create
router.post("/", function(req, res){
    Person.create(req.body, function(err, Person){
        if(err) return res.json(err);
        res.redirect("/users");
    });
});

// show
router.get("/:username", function(req, res){
    Person.findOne({username:req.params.username}, function(err, user){
        if(err) return res.json(err);
        res.render("register", {Person:Person});
    });
});

// edit
router.get("/:username/edit", function(req, res){
    Person.findOne({username:req.params.username}, function(err, Person){
        if(err) return res.json(err);
        res.render("users/edit", {Person:Person});
    });
});

// update // 2
router.put("/:username",function(req, res, next){
    Person.findOne({username:req.params.username}) // 2-1
        .select("password") // 2-2
        .exec(function(err, Person){
            if(err) return res.json(err);

            // update user object
            Person.originalPassword = user.password;
            Person.password = req.body.newPassword? req.body.newPassword :Person.password; // 2-3
            for(var p in req.body){ // 2-4
                user[p] = req.body[p];
            }

            // save updated user
            Person.save(function(err, Person){
                if(err) return res.json(err);
                res.redirect("/users/"+req.params.email);
            });
        });
});

module.exports = router;


var express = require("express");
var router = express.Router();
var passport= require("passport"); // 1
var Proj_menu = require("../model/proj_menu");
// Home ...
router.get("/",function (req,res) {
   res.render("login");
});
router.get('/new', function (req, res) {
    console.log(req.user._id);
    res.render('new');
});
router.post("/new", function(req, res){
    req.body.owner = req.user._id;
    Proj_menu.create(req.body, function(err, Proj_menu){
        if(err){
            req.flash("post", req.body);
            req.flash("errors", util.parseError(err));
            return res.redirect("new");
        }
        res.redirect("/proj");
    });
});
// Login // 2
router.get("/register", function (req,res) {

   res.render("register");
});

// Post Login // 3
router.post('/login', passport.authenticate('local-login', {
    failureRedirect: '/fail',
    successRedirect : '/proj',
    failureFlash : true
}));
router.post('/signup', passport.authenticate('signup', {
    successRedirect : '/',
    failureRedirect : '/register',
    failureFlash : true
}));

// Logout // 4
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;
var express = require('express');
var router = express.Router();
var Proj_menu = require("../model/proj_menu");
/* GET home page. */
router.get('/', function(req, res) {
    Proj_menu.find({},function (err, Proj_menu) {
        if(err)return res.json(err);

        res.render("index",{Proj_menu:Proj_menu});
    });
});
router.get('/new', function(req, res) {
    res.render("new");

});
router.post('/new',function (req, res) {
    Proj_menu.create(req.body,function (err, Proj_menu) {
        if(err) return res.json(err);
        res.redirect("new");
    })
})
module.exports = router;

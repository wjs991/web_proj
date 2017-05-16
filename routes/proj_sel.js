/**
 * Created by wjs99 on 2017-05-08.
 */

var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Proj_menu = require("../model/proj_menu");
var $ = require("jquery");
router.get('/', function(req, res) {
    Proj_menu.find({},function (err, Proj_menu) {
        if(err)return res.json(err);

        res.render("index",{Proj_menu:Proj_menu});
    });
});
router.get("/proj/calener/:id",function (req,res) {
    Proj_menu.find({ _id:req.params.id},function (err, Proj_menu) {
        console.log("1234");
        if (err)return res.json(err);
        res.render("proj/calener",{Proj_menu:Proj_menu});
    })

});

router.get('/proj/Proj_view/:id',function (req,res) {
    Proj_menu.find({ _id:req.params.id},function (err, Proj_menu) {
        console.log("1234");
        if (err)return res.json(err);
        res.render("proj/Proj_view",{Proj_menu:Proj_menu});
    })
});
router.get('/proj/pages/communication/:id',function (req,res) {
    console.log(req.toString());
    Proj_menu.find({ _id:req.params.id},function (err, Proj_menu) {
        console.log("1234");
        if (err)return res.json(err);
        res.render("proj/pages/communication",{Proj_menu:Proj_menu});
    })
})

module.exports = router;
/**
 * Created by wjs99 on 2017-05-08.
 */

var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Proj_menu = require("../model/proj_menu");

router.get("/",function (req,res) {
    res.render("proj/Proj_view");
});

router.get('/:id',function (req,res) {
    Proj_menu.find({ _id:req.params.id},function (err, Proj_menu) {

        if (err)return res.json(err);
        res.render("proj/Proj_view",{Proj_menu:Proj_menu});
    })
});

module.exports = router;
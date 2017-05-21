/**
 * Created by wjs99 on 2017-05-09.
 */
var express = require('express');
var mongoose = require('mongoose');
mongoose.Promise=global.Promise;
var Proj_Schema = mongoose.Schema({
    //db 명세
    project_name:{type:String}, //프로젝트명
    owner:{type:mongoose.Schema.Types.ObjectId,ref:"Person", required : true},                //주인
    phone:{type:String},
    createdAt:{type:Date, default:Date.now}, // 만들어진 시간
    updatedAt:{type:Date}                     // 업데이트된 시간
},{
    toObject:{
        virtuals:true
    }
});

Proj_Schema.virtual("createdDate").get(function () {
    return getDate(this.createdAt);
});
Proj_Schema.virtual("createdTime")
    .get(function(){
        return getTime(this.createdAt);
    });

Proj_Schema.virtual("updatedDate")
    .get(function(){
        return getDate(this.updatedAt);
    });

Proj_Schema.virtual("updatedTime")
    .get(function(){
        return getTime(this.updatedAt);
    });






function getDate(dateObj){
    if(dateObj instanceof Date)
        return dateObj.getFullYear() + "-" + get2digits(dateObj.getMonth()+1)+ "-" + get2digits(dateObj.getDate());
}

function getTime(dateObj){
    if(dateObj instanceof Date)
        return get2digits(dateObj.getHours()) + ":" + get2digits(dateObj.getMinutes())+ ":" + get2digits(dateObj.getSeconds());
}

function get2digits(num){
    return ("0" + num).slice(-2);
}
var proj_menu = mongoose.model("post", Proj_Schema);    //model생성 proj_schema
module.exports = proj_menu;
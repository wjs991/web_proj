var mongoose=require('mongoose');

personSchema=mongoose.Schema({
    id: String,
    pw: String,
    nickName: String,
    name: String,
    gender: Boolean,
    phNum: String,
    email: String
});

Person=mongoose.model('person', personSchema);

module.exports=Person;


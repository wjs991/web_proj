var mongoose=require('mongoose');
var bcrypt = require('bcrypt-nodejs');
personSchema=mongoose.Schema({
    email: String,
    password: String,
    name: String
});

personSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
//password의 유효성 검증
personSchema.methods.validPassword = function(password) {
    var Person =this;
    return bcrypt.compareSync(password, Person.password);
};

Person=mongoose.model('Person', personSchema);

module.exports=Person;


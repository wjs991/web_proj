/**
 * Created by wjs99 on 2017-05-19.
 */
var passport   = require("passport");
var LocalStrategy = require("passport-local").Strategy; // 1
var Person     = require("../model/dbScheme");

// serialize & deserialize User //
module.exports = function (passport) {
passport.serializeUser(function(Person, done) {
    done(null, Person.id);
});
passport.deserializeUser(function(id, done) {
Person.findById(id,function (err, Person) {
    done(err,Person);
})
});

};
passport.use('local-login',new LocalStrategy({
    usernameField: 'email',
    passwordField : 'password',
    passReqToCallback : true
}, function (req, email, password, done) {
    Person.findOne({ email: email}, function (err, Person) {
        if (err)
            return done(err);
        if (!Person)
            return done(null, false, req.flash('loginMessage', '사용자를 찾을 수 없습니다.'));
        if (!Person.validPassword(password))
            return done(null, false, req.flash('loginMessage', '비밀번호가 다릅니다.'));
        return done(null, Person);
    });
}));
passport.use('signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        Person.findOne({ 'email' : email }, function(err, person) {

            if (err) return done(err);
            if (person) {
                return done(null, false, console.log('signupMessage', '이메일이 존재합니다.'));
            } else {
                var newUser = new Person();
                newUser.name = req.body.name;
                console.log(req.body.name.toString());
                newUser.email = email;
                newUser.password = newUser.generateHash(password);
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });
    }));

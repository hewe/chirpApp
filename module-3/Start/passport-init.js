/*jslint node:true */
'use strict';
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var users = {};
module.exports = function(passport) {
    // serialize the user session into the passport session store
    // here we are serializing a user session instance with just the
    // user name to make session store small
    passport.serializeUser(function(user, done){
    	console.log('serializing user: ', user.username);
    	return done(null, user.username);
    });
    
	//Desieralize user will call with the unique id provided by serializeuser
    passport.deserializeUser(function(username, done){
    	return done(null, users[username]);
    });

    passport.use('signup', new LocalStrategy({
            passReqToCallback: true //passpor.js automatically already parses out the username and password from the form of the rest request body and setting passReqToCallback will pass this data to the callback
        },
        function(req, username, password, done) {
            if (users[username]) {
                return done('user name already taken', false);
            }

            users[username] = {
                username: username,
                password: createHash(password)
            };
            return done(null, users[username]);
        }
    ));

    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        },

        function(req, username, password, done) {
            if (!users[username]) {
                return done('user not found', false);
            }

            if (!isValidPassword(users[username], password)) {
                return done('invalid password', false);
            }

            console.log('successfuly signed in');
            return done(null, users[username]);
        }
    ));

    var createHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

    var isValidPassword = function(user, password) {
        return bCrypt.compareSync(password, user.password);
    };

};

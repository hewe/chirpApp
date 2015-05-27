/*jslint node: true*/
'use strict';

var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

//since the Post and User models already have been compiled in the models.js which was required by app.js earlier on
var User = mongoose.model('User');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
		console.log('serializing user:',user._id);
		//return the unique id for the user
		done(null, user._id);
	});

	//Desieralize user will call with the unique id provided by serializeuser
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(error, user){
			if(error){
				return done(error, false);
			}

			if(!user){
				return done(null, false, { message: 'user not found' });
			}

			return done(null, user);
		});
	});

	passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) { 
			User.findOne({username: username}, function(error, user){
				if(error){
					//this would be database error
					return done(error, false);
				}

				if(!user){
					//this is user not found
					return done('user does not exists', false);
				}

				if(isValidPassword(user, password)){
					return done(null, user);
				}
				else{
					return done(null, false, { message: 'invalid password'});
				}
			});
		}
	));

	passport.use('signup', new LocalStrategy({
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		function(req, username, password, done) {

			//findOne(condition, callback) takes a condition which is a json and a callback function
			//where error is any error, and user would be the document that is found for the User model
			//based on the condition
			User.findOne({username: username}, function(error, user){
				if(error){
					return done(error, false);
				}

				if(user){
					console.log('user already exists dam it');
					return done(null, false, { message: 'user already exists' });
				}
				else {
					//this creates a new user document based on User model
					var newUser = new User({
						username: username,
						password: createHash(password)
					});

					//A mongo document has a save function tp save doc to db
					newUser.save(function(error, user){
						if(error){
							return done(error, false);
						}
						else{
							console.log('successfully signed up user ' + user.username);
							return done(null, user);
						}
					});
				}
			});
		})
	);
	
	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
	// Generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};
};

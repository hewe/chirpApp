/*jslint node:true*/
'use strict';
var express = require('express');
var router = express.Router();


module.exports = function(passport){
	router.get('/success', function(req, res){
		res.send({state: 'success', user: req.user ? req.user : null});
	});
	router.get('/failure', function(req, res){
		res.send({state: 'failure', user: null, message: 'invalid user or password.'});
	});
	router.post('/login', passport.authenticate('login', {
		successRedirect: 'success',
		failureRedirect: 'failure'
	}));
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: 'success',
		failureRedirect: 'failure'
	}));
	router.get('/signout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	return router;
};
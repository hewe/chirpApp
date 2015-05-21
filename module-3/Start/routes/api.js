/*jslint node:true*/
'use strict';
var express = require('express');
var router = express.Router();

//add middleware to api router
router.use(function(req, res, next){
	if (req.method === 'GET'){
		return next();
	}

	if (!req.isAuthenticated()){
		return res.redirect('/#login');
	}

	return next();
});

router.route('/posts')
	.get(function(req, res){
		res.send({message: 'Todo return all posts'});
	})
	.post(function(req, res){
		res.send({message: 'Todo create a post'});
	});

router.route('/posts/:id')
	.get(function(req, res){
		res.send({message: 'Todo get post with id ' + req.params.id});
	})
	.put(function(req, res){
		res.send({message: 'Todo update post with id ' + req.params.id});
	})
	.delete(function(req, res){
		res.send({message: 'Todo delete post with id ' + req.params.id});
	});

module.exports = router;
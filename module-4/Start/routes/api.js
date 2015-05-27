/*jslint node:true*/
'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

//The middleware used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects

	//allow all get request methods
	if(req.method === 'GET'){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}

	// if the user is not authenticated then redirect him to the login page
	return res.redirect('/#login');
}

//Register the authentication middleware
router.use('/posts', isAuthenticated);

//api for all posts
router.route('/posts')
	
	//create a new post
	.post(function(req, res){
		console.log('text: ' + req.body.text);
		console.log('username: ' + req.body.username);

		var newPost = new Post({
			text: req.body.text,
			username: req.body.username
		});

		newPost.save(function(error, post){
			if(error){
				return res.send(500, error);
			}

			return res.json(post);
		});
	})

	.get(function(req, res){
		Post.find(function(error, posts){
			if (error){
				return res.send(500, error);
			}

			return res.json(posts);
		});
	});

//api for a specfic post
router.route('/posts/:id')

	.put(function(req,res){
		Post.findById(req.params.id, function(error, post){
			if(error){
				return res.send(500, error);
			}

			post.text = req.body.text;
			post.username = req.body.username;

			post.save(function(error, post){
				if(error){
					return res.send(500, error);
				}
				return res.json(post);
			});
		});
	})

	.get(function(req,res){
		Post.findById(req.params.id, function(error, post){
			if(error){
				return res.send(500, error);
			}
			if(!post){
				return res.send(404);
			}

			return res.json(post);
		});
	})

	.delete(function(req,res){
		Post.remove({_id: req.params.id}, function(error){
			if(error){
				return res.send(error);
			}

			return res.json('deleted :(');
		});
	});

module.exports = router;
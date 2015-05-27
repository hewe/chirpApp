/*jslint node:true*/
'use strict';

var mongoose = require('mongoose');

//First define the mongo schema, then create model from the schema
var Schema = mongoose.Schema; // mongoose.Schema points to a constructor function for creating Schemas
var userSchema = new Schema({
	username: String,
	password: String,
	created_at: {type: Date, default: Date.Now}
});

var postSchema = new Schema({
	text: String,
	username: String,
	created_at: {type: Date, default: Date.Now}
});

//compile the schemas defined above into respective models which are classes used to create mongodb documents or instances of the model
mongoose.model('User', userSchema);
mongoose.model('Post', postSchema);
var models = require("./models");
var internals = {};

internals.createPost = function(input, callback){
	var errorMessages = [];
	var title = input.title;
	var content = input.content;
	var status = input.status;
	var systemid = input.systemid;
	var userid = input.userid;
	var comments = input.comments === true ? 1 : 0;
	if (systemid === undefined || userid === undefined){
		errorMessages.push("createPost() requires login");
		callback(new Error(errorMessages));
	}
	else{
		models.Post.create({
			title:title,
			content:content,
			SystemId:systemid,
			UserId:userid,
			status:status,
			comments_allowed:comments
		}).then(function(post) {
			callback(null, post);
		}).catch(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}
};

internals.updatePost = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	var title = input.title;
	var content = input.content;
	var status = input.status;
	var comments = input.comments === true ? 1 : 0;
	models.Post.find({
		where:{
			id:id
		}
	}).then(function(post) {
		post.updateAttributes({
			title: title,
			content: content,
			status: status,
			comments_allowed:comments
		}).then(function(post) {
			callback(null,post);
		}).catch(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}).catch(function(error){
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
};

internals.getPost = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	var systemid = input.systemid;
	var status = input.status;
	if(systemid === undefined){
		errorMessages.push("getPost() requires login");
		callback(new Error(errorMessages));
	}
	else{
		var whereClause = {
			where:{
				systemid: systemid,
				deleted: false
			},
			order: "id DESC"
		};
		if (id !== undefined){
			whereClause.where.id = id;
		}
		if (status !== undefined){
			whereClause.where.status = status;
		}
		models.Post.findAll(whereClause
		).then(function(posts){
			callback(null, posts);
		}).catch(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}
};

internals.deletePost = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	models.Post.find({
		where:{
			id:id
		}
	}).then(function(post) {
		post.updateAttributes({
			deleted: 1
		}).then(function(post) {
			callback(null,post);
		}).catch(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}).catch(function(error){
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
};

module.exports = internals;
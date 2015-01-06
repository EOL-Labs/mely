var models = require("./models");
var internals = {};

internals.createComment = function(input, callback){
	var errorMessages = [];
	var systemid = input.systemid;
	var email = input.email;
	var content = input.content;
	var postid = input.postid;
	if(systemid === undefined){
		errorMessages.push("createComment() requires a systemid");
		callback(new Error(errorMessages));
	}
	else{
		models.Comment.create({
			SystemId:systemid,
			email:email,
			content:content,
			PostId:postid,
			approved:0
		}).then(function(comment){
			callback(null, comment);
		}).catch(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}
};

internals.approveComment = function(input, callback){
	var errorMessages = [];
	var commentid = input.commentid;
	var direction = input.direction;
	models.Comment.find({
		where:{
			id:commentid
		}
	}).then(function(comment){
		comment.updateAttributes({
			approved: direction
		}).then(function(comment){
			callback(null,comment);
		}).catch(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}).catch(function(error){
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
};

internals.getComment = function(input, callback){
	var errorMessages = [];
	var postid = input.postid;
	var approved = input.approved;
	var systemid = input.systemid;
	if(systemid === undefined){
		errorMessages.push("getComment() requires login");
		callback(new Error(errorMessages));
	}
	else{
		var whereClause = {
			where:{
				systemid: systemid
			},
			order: "id DESC"
		};
		if (postid !== undefined){
			whereClause.where.PostId = postid;
		}
		if (approved !== undefined){
			whereClause.where.approved = true;
		}
		models.Comment.findAll(whereClause
		).then(function(comments) {
			callback(null, comments);
		}).catch(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}
};

internals.upComment = function(input, callback){
	var errorMessages = [];
	var commentid = input.commentid;
	models.Comment.find({
		where:{
			id: commentid
		}
	}).then(function(comment){
		comment.updateAttributes({
			upvote: comment.upvote + 1
		}).then(function(comment){
			callback(null,comment);
		});
	}).catch(function(error){
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
};

internals.downComment = function(input, callback){
	var errorMessages = [];
	var commentid = input.commentid;
	models.Comment.find({
		where:{
			id: commentid
		}
	}).then(function(comment){
		comment.updateAttributes({
			downvote: comment.downvote + 1
		}).then(function(comment) {
			callback(null,comment);
		});
	}).catch(function(error){
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
};

module.exports = internals;
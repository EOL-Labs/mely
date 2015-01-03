var models = require("./models");
var internals = {};

internals.createUser = function(input, callback){
	var errorMessages = [];
	var email = input.email;
	var password = input.password;
	var systemid = input.systemid;
	models.User.create({
		email_address: email,
		password: password,
		status: true,
		SystemId:systemid
	}).then(function(user) {
		callback(null, user);
	}).catch(function(error){
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
};

internals.getUser = function(input, callback){
	var errorMessages = [];
	var systemid = input.systemid;
	var userid = input.userid;
	if(systemid === undefined){
		errorMessages.push("getUser() requires log in");
		callback(new Error(errorMessages));
	}
	else{
		var whereClause = {
			where:{
				status: true,
				systemid: systemid
			}
		};
		if (userid !== undefined){
			whereClause.where.id = userid;
		}
		models.User.findAll(whereClause).then(function(users) {
			callback(null, users);
		}).catch(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}
};

internals.deleteUser = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	models.User.find({
		where:{
			id:id
		}
	}).then(function(user) {
		user.updateAttributes({
			status: false
		}).then(function(deleted) {
			callback(null, deleted);
		}).catch(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}).catch(function(error){
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
};

internals.loginUser = function(input, callback){
	var errorMessages = [];
	var email = input.email;
	var password = input.password;
	models.User.find({
		where:{
			email_address: email,
			password: password,
			status: true
		},
		attributes:[
			"id",
			"email_address",
			"SystemId"
		]
	}).then(function(user){
		callback(null, user);
	}).catch(function(error){
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
};

internals.resetPassword = function(input, callback){
	var errorMessages = [];
	var email = input.email;
	var password = input.password;
	models.User.find({
		where:{
			email_address: email,
			status: true
		}
	}).then(function(user) {
		if(user === null){
			callback("No Email");
		}
		else{
			user.updateAttributes({
				password: password
			}).then(function(){
				callback(null, password);
			}).catch(function(error){
				errorMessages.push(error);
				callback(new Error(errorMessages));
			});
		}			
	}).catch(function(error){
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
};

module.exports = internals;
var internals = {}
var models = require('./models');
var crypto = require('crypto');

internals.loginView = function(request, reply){
	var pageDetails = {
		title: "Mely - LOGIN"
	}
	reply.view("login/index", pageDetails)
}

internals.adminView = function(request, reply){
	var pageDetails = {
		title: "Mely - ADMIN"
	}
	reply.view("admin/index", pageDetails)
}

internals.login = function(request, reply){
	var email_address = request.payload["mely-email"]
	var password = request.payload["mely-password"]
	var passwordHashed = crypto.createHash('sha256').update(password).digest("hex");
	models.User.find({ 
		where:{
			email_address: email_address,
			password: passwordHashed
		},
		attributes: ["id","email_address","SystemId"]
	}).success(function(user){
		if (user == null){
			reply().redirect("/login?invalid")
		}
		else{
			request.auth.session.set(user.dataValues)
			reply().redirect("/admin")
		}
	}).error(function(error){console.log(error)})
}

exports.loginView = internals.loginView
exports.adminView = internals.adminView
exports.login = internals.login
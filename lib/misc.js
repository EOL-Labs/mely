var internals = {}
var models = require('./models');
var crypto = require('crypto');
internals.welcome = function(request, reply){
	models.System.count().success(function(systemCount) {
		if (systemCount > 0){
				reply().redirect("/login")
		}
		else{
			var pageDetails = {
				title: "Welcome to Mely!"
			}
			reply.view("welcome",pageDetails)
		}
	})
}

internals.setup = function(request, reply){
	var system_name = request.payload["mely-name"]
	var system_descrip = request.payload["mely-description"]
	var email = request.payload["mely-email"]
	var password = request.payload["mely-password"]
	var passwordHashed = crypto.createHash('sha256').update(password).digest("hex");
	
	models.System.create({ system_name:system_name, system_description:system_descrip, system_status: true}).success(function(system) {
		var systemID = system.id
		models.User.create({ email_address:email, password:passwordHashed, user_status: true, SystemId:systemID }).success(function(user) {
			//redirects to login screen
			reply().redirect("/login")
		}).error(function(error){console.log(error)})
	}).error(function(error){console.log(error)})
}

exports.welcome = internals.welcome
exports.setup = internals.setup
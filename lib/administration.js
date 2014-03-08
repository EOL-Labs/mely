var internals = {}
var models = require('./models');
var crypto = require('crypto');
var moment = require('moment');

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

internals.logout = function(request, reply){
	request.auth.session.clear()
	reply().redirect("/login")
}

internals.users = function(request, reply){
	models.User.findAll({ where: { user_status: true }}).success(function(users) {
		var userList = []
		for (var user in users) {
			var row = {}
			row.userid = users[user].id 
			row.email = users[user].email_address
			row.createdDate = moment(users[user].createdAt).format('MMMM Do YYYY, h:mm:ss a')
			row.updatedDate = moment(users[user].updatedAt).format('MMMM Do YYYY, h:mm:ss a')

			if (users[user].user_status){
				row.status = "Active"
			}
			else{
				row.status = "Inactive"
			}		 
			userList.push(row)
		}
		
		var pageDetails = {
			title: "Mely - USERS",
			userList: userList
		}
		reply.view("admin/user/index", pageDetails)
	})
}

internals.userEditView = function(request, reply){
	var userID = request.params.id
	models.User.find({ where: { id:userID }}).success(function(user) {		
		var row = {}
		row.userid = user.id 
		row.email = user.email_address
		var pageDetails = {
			title: "Mely - EDIT USER",
			user: row
		}
		reply.view("admin/user/edit", pageDetails)
	})
}

internals.userEdit = function(request, reply){
	var userID = request.payload["mely-userid"]
	var email = request.payload["mely-email"]

	models.User.find({ where: { id:userID }}).success(function(user) {
		user.updateAttributes({
			email_address: email
		}).success(function() {
			console.log("success")
			reply().redirect("/admin/user")
		})	
	})
}

internals.userDelete = function(request, reply){
	var userID = request.params.id

	models.User.find({ where: { id:userID }}).success(function(user) {
		user.updateAttributes({
			user_status: false
		}).success(function() {
			reply("deleted")
		})	
	})
}

internals.userNewView = function(request, reply){
	var pageDetails = {
		title: "Mely - NEW USER"
	}
	reply.view("admin/user/new", pageDetails)

}

internals.userCreate = function(request, reply){
	var email = request.payload["mely-email"]
	var password = request.payload["mely-password"]
	var passwordHashed = crypto.createHash('sha256').update(password).digest("hex");
	var systemID = request.auth.credentials.SystemId
	models.User.create({ email_address:email, password:passwordHashed, user_status: true, SystemId:systemID }).success(function(user) {
		reply().redirect("/admin/user")
	}).error(function(error){console.log(error)})
	
}

exports.loginView = internals.loginView
exports.adminView = internals.adminView
exports.login = internals.login
exports.logout = internals.logout
exports.users = internals.users
exports.userNewView = internals.userNewView
exports.userCreate = internals.userCreate
exports.userEditView = internals.userEditView
exports.userEdit = internals.userEdit
exports.userDelete = internals.userDelete
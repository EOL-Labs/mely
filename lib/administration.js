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

internals.pages = function(request, reply){
	models.Page.findAll().success(function(pages) {
		var pageList = []
		for (var page in pages) {
			var row = {}
			row.pageId = pages[page].id
			row.title = pages[page].page_title 
			row.content = pages[page].page_content 
			switch(pages[page].StatuId){
				case 1:
					row.status = "Published"
					break
				case 2:
					row.status = "Draft"
					break
				case 3:
					row.status = "Deleted"
					break
			}			 
			pageList.push(row)	
		}

		var pageDetails = {
			title: "Mely - PAGES",
			pageList: pageList
		}
		console.log(pageDetails)
		reply.view("admin/page/index", pageDetails)
	})
}

internals.pageNewView = function(request, reply){
	models.Status.findAll().success(function(statuses) {
		var statusList = []
		for (var status in statuses) {
			if (statuses[status].id != 3){
				var row = {}
				row.statusID = statuses[status].id
				row.statusName = statuses[status].status_name
				statusList.push(row)
			}
		}
		var pageDetails = {
			title: "Mely - NEW PAGE",
			statusList: statusList
		}
		reply.view("admin/page/new", pageDetails)
	})
}

internals.pageCreate = function(request, reply){
	var title = request.payload["mely-page-title"]
	var content = request.payload["mely-page-content"]
	var statusID = request.payload["mely-page-status"]
	var systemID = request.auth.credentials.SystemId
	var userID = request.auth.credentials.id
	models.Page.create({ page_title:title , page_content:content , SystemId:systemID , UserId:userID , StatuId:statusID }).success(function(user) {
		reply().redirect("/admin/page")
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
exports.pages = internals.pages
exports.pageNewView = internals.pageNewView
exports.pageCreate = internals.pageCreate
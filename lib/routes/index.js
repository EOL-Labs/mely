var crypto = require('crypto');
var administration = require("../administration");
var misc = require("../misc");
var mely = require("../mely");


var Mely = {};
module.exports = Mely;
Mely.Administrator = administration;




exports.routes = [
	{
		method: "GET",
		path: "/admin/user",
		config: {
			handler: function(){
				var request = this;
				var session = request.auth.credentials
				if (session) {
					Mely.getUser({
						sysID: request.auth.credentials.SystemId
					}, function(err, getUser){
						if (err) throw err;
						var userList = []
						for (var user in getUser) {
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
				} else {
					request.reply({error: 'Must be logged in.'});
				}
			}
		}
	},
	{
		method: "POST",
		path: "/admin/user",
		config: {
			handler: function(){
				var request = this;
				var email = request.payload["mely-email"]
				var password = request.payload["mely-password"]
				password = crypto.createHash('sha256').update(password).digest("hex");
				var session = request.auth.credentials
				if (session) {
					Mely.createUser({
						email: email,
						password: password
						sysID: request.auth.credentials.SystemId
					}, function(err, addUser){
						if (err) throw err;
						reply().redirect("/admin/user")
					})
				} else {
					request.reply({error: 'Must be logged in.'});
				}
			} 
	    }
	},
	{
		method: "GET",
		path: "/admin/user/new",
		config:{
			handler: function(){
				var pageDetails = {
					title: "Mely - NEW USER"
				}
				reply.view("admin/user/new", pageDetails)
			}
		}
	},
	{
		method: "GET",
		path: "/admin/user/{id}",
		config:{
			handler: function(){
				var request = this;
				var userID = request.params["id"]
				var session = request.auth.credentials
				if (session) {
					Mely.getUser({
						sysID: request.auth.credentials.SystemId,
						userID: userID
					}, function(err, getUser){
						if (err) throw err;
						var user = {}
						user.userid = getUser.id 
						user.email = getUser.email_address
						var pageDetails = {
							title: "Mely - EDIT USERS",
							userList: user
						}
						reply.view("admin/user/edit", pageDetails)
					})
				} else {
				request.reply({error: 'Must be logged in.'});
				}
			}
		}
	},
	{
		method: "POST",
		path: "/admin/user/{id}",
		config:{
			handler: function(){
				var request = this;
				var userID = request.params["id"]
				var email = request.params["mely-email"]
				var session = request.auth.credentials
				if (session) {
					Mely.updateUser({
						userID: userID,
						email: email
					}, function(err, getUser){
						if (err) throw err;
						reply().redirect("/admin/user")
					})
				} else {
					request.reply({error: 'Must be logged in.'});
				}	
			}
		}
	},
	{
		method: "DELETE",
		path: "/admin/user/{id}",
		config:{
			handler: function(){
				var request = this
				var userID = request.params.id
				var session = request.auth.credentials
				if (session) {
					Mely.deleteUser({
						userID: userID
					}, function(err, deleted){
						if (err) throw err;
						reply().redirect("/admin/user")
					})
				}
				else{
					request.reply({error: 'Must be logged in.'});
				}
			}
		}
	},



	///all needs to be rewritten
	{ method: "GET", path: "/welcome", config: { handler: misc.welcome, auth: false } },
	{ method: "POST", path: "/setup", config: { handler: misc.setup, auth: false } },
	{ method: "GET", path: "/login", config: { handler: administration.loginView, auth: { mode: "try"} } },
	{ method: "GET", path: "/logout", config: { handler: administration.logout, auth: false } },
	{ method: "POST", path: "/login", config: { handler: administration.login, auth: false } },
	{ method: "GET", path: "/admin", config: { handler: administration.adminView } },
	{ method: "GET", path: "/admin/page", config: { handler: administration.pages } },
	{ method: "POST", path: "/admin/page", config: { handler: administration.pageCreate } },
	{ method: "GET", path: "/admin/page/new", config: { handler: administration.pageNewView } },
	{ method: "GET", path: "/admin/page/{id}", config: { handler: administration.pageEditView } },
	{ method: "POST", path: "/admin/page/{id}", config: { handler: administration.pageEdit } },
	{ method: "GET", path: "/admin/post", config: { handler: administration.posts } },
	{ method: "POST", path: "/admin/post", config: { handler: administration.postCreate } },
	{ method: "GET", path: "/admin/post/new", config: { handler: administration.postNewView } },
	{ method: "GET", path: "/admin/post/{id}", config: { handler: administration.postEditView } },
	{ method: "POST", path: "/admin/post/{id}", config: { handler: administration.postEdit } },
	{ method: "GET", path: "/admin/theme", config: { handler: administration.themes } },
	{ method: "POST", path: "/admin/theme", config: { handler: administration.themeCreate } },
	{ method: "GET", path: "/admin/theme/new", config: { handler: administration.themeNewView } },
	{ method: "GET", path: "/admin/theme/{id}", config: { handler: administration.themeEditView } },
	{ method: "POST", path: "/admin/theme/{id}", config: { handler: administration.themeEdit } },
	{ method: "GET", path: "/admin/file", config: { handler: administration.themeFiles } },
	{ method: "GET", path: "/admin/theme/activate/{id}", config: { handler: administration.themeActivate } },
	{ method: "POST", path: "/admin/markdown", config: { handler: administration.markdown } },
	{ method: "GET", path: "/", config: { handler: mely.home, auth: false} },
	{
		method: "*",
		path: "/{path*}",
		config: {
			handler: {
				directory: {
					path: "./static/",
					listing: false,
					redirectToSlash:true
				}
			},
			auth: false
		}
		
	}
]
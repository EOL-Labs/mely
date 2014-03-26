var internals = {}
var models = require('./models');
var crypto = require('crypto');
var moment = require('moment');
var marked = require('marked');
var changeCase = require('change-case');

internals.loginView = function(request, reply){
	if (request.auth.credentials != null){
		reply().redirect("/admin")
	}
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
			row.content = marked(pages[page].page_content)
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

internals.pageEditView = function(request, reply){
	var pageID = request.params.id
	models.Page.find({ where: { id:pageID }}).success(function(page) {		
		var page_single = {}
		page_single.pageid = page.id 
		page_single.title = page.page_title
		page_single.content = page.page_content
		page_single.statusID = page.StatuId

		models.Status.findAll().success(function(statuses) {
			var statusList = []
			for (var status in statuses) {
				var row = {}
				row.statusID = statuses[status].id
				row.statusName = statuses[status].status_name
				if (page_single.statusID == row.statusID){
					row.selected = true
				}
				statusList.push(row)
			}
			var pageDetails = {
				title: "Mely - EDIT PAGE",
				page: page_single,
				statusList: statusList
			}
			reply.view("admin/page/edit", pageDetails)
		})
	})
}

internals.pageEdit = function(request, reply){
	var pageID = request.payload["mely-pageid"]
	var title = request.payload["mely-page-title"]
	var content = request.payload["mely-page-content"]
	var statusID = request.payload["mely-page-status"]
	models.Page.find({ where: { id:pageID }}).success(function(page) {
		page.updateAttributes({
			page_title: title,
			page_content: content,
			StatuId: statusID
		}).success(function() {
			console.log("success")
			reply().redirect("/admin/page")
		})	
	})
}

internals.posts = function(request, reply){
 	models.Post.findAll().success(function(posts) {
 		var postList = []
 		for (var post in posts) {
 			var row = {}
 			row.postId = posts[post].id
 			row.title = posts[post].post_title 
 			row.content = marked(posts[post].post_content)
 			switch(posts[post].StatuId){
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
 			postList.push(row)	
 		}

 		var pageDetails = {
 			title: "Mely - POSTS",
 			postList: postList
 		}
 		reply.view("admin/post/index", pageDetails)
 	})
}

internals.postNewView = function(request, reply){
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
 			title: "Mely - NEW POST",
 			statusList: statusList
 		}
 		reply.view("admin/post/new", pageDetails)
 	})
}

internals.postCreate = function(request, reply){
	var title = request.payload["mely-post-title"]
 	var content = request.payload["mely-post-content"]
 	var statusID = request.payload["mely-post-status"]
 	var systemID = request.auth.credentials.SystemId
 	var userID = request.auth.credentials.id
 	models.Post.create({ post_title:title , post_content:content , SystemId:systemID , UserId:userID , StatuId:statusID }).success(function(post) {
 		reply().redirect("/admin/post")
 	}).error(function(error){console.log(error)})	
}

internals.postEditView = function(request, reply){
 	var postID = request.params.id
 	models.Post.find({ where: { id:postID }}).success(function(post) {		
 		var post_single = {}
 		post_single.postid = post.id 
 		post_single.title = post.post_title
 		post_single.content = post.post_content
 		post_single.statusID = post.StatuId

 		models.Status.findAll().success(function(statuses) {
 			var statusList = []
 			for (var status in statuses) {
 				var row = {}
 				row.statusID = statuses[status].id
 				row.statusName = statuses[status].status_name
 				if (post_single.statusID == row.statusID){
 					row.selected = true
 				}
 				statusList.push(row)
 			}
 			var pageDetails = {
 				title: "Mely - EDIT POST",
 				post: post_single,
 				statusList: statusList
 			}
 			reply.view("admin/post/edit", pageDetails)
 		})
 	})
}

internals.postEdit = function(request, reply){
 	var postID = request.payload["mely-postid"]
 	var title = request.payload["mely-post-title"]
 	var content = request.payload["mely-post-content"]
 	var statusID = request.payload["mely-post-status"]
 	models.Post.find({ where: { id:postID }}).success(function(post) {
 		post.updateAttributes({
 			post_title: title,
 			post_content: content,
 			StatuId: statusID
 		}).success(function() {
 			reply().redirect("/admin/post")
 		})	
 	})
}

internals.themeNewView = function(request, reply){
	var pageDetails = {
		title: "Mely - NEW THEME"
	}
	reply.view("admin/theme/new", pageDetails)
}

internals.themeCreate = function(request, reply){
	var systemID = request.auth.credentials.SystemId

	models.Theme.create({
		theme_name: request.payload.themename,
		theme_description: request.payload.themedescription,
		theme_status: true,
		theme_active: false,
		SystemId: systemID
	}).success(function(theme) {
		var themeID = theme.id
		models.ThemeSetting.create({
			header_logo: null,
			header_backgroundcolor: request.payload.headerbackcolor,
			header_fontcolor: request.payload.headerfontcolor,
			header_fontsize: request.payload.headerfontsize,
			menu_backgroundcolor: request.payload.menubackcolor,
			menu_fontcolor: request.payload.menufontcolor,
			menu_fontsize: request.payload.menufontsize,
			post_titlefontcolor: request.payload.posttitlecolor,
			post_titlefontsize: request.payload.posttitlefontsize,
			post_contentfontcolor: request.payload.postcontentcolor,
			post_contentfontsize: request.payload.postcontentfontsize,
			page_titlefontcolor: request.payload.pagetitlecolor,
			page_titlefontsize: request.payload.pagetitlefontsize,
			page_contentfontcolor: request.payload.pagecontentcolor,
			page_contentfontsize: request.payload.pagecontentfontsize,
			ThemeId: themeID
		}).success(function(themesettings) {
		})
	})
	reply().redirect("/admin/theme")
}

internals.themes = function(request, reply){
	models.Theme.findAll().success(function(themes) {
		var themeList = []
		for (var theme in themes) {
			var row = {}
			row.themeid = themes[theme].id
			row.name = themes[theme].theme_name
			row.description = themes[theme].theme_description
			row.active = themes[theme].theme_active
			if (themes[theme].theme_status){
				row.status = "Usable"
			}
			else{
				row.status = "Deleted"
			}		 
			themeList.push(row)
		}
		var pageDetails = {
			title: "Mely - THEMES",
			themeList: themeList
		}
	reply.view("admin/theme/index", pageDetails)
	})
}

internals.themeEditView = function(request, reply){
	var themeID = request.params.id
	models.Theme.find({ where: { id:themeID }}).success(function(theme) {
		var theme_single = {}
		theme_single.themeID = theme.id 
		theme_single.name = theme.theme_name
		theme_single.description = theme.theme_description
		models.ThemeSetting.find({ where: { id:themeID }}).success(function(settings) {
			var theme_settings = {}
			theme_settings.headlogo = settings.header_logo
			theme_settings.headbackcolor = settings.header_backgroundcolor
			theme_settings.headfontcolor = settings.header_fontcolor
			theme_settings.headfontsize = settings.header_fontsize
			theme_settings.menubackcolor = settings.menu_backgroundcolor
			theme_settings.menufontcolor = settings.menu_fontcolor
			theme_settings.menufontsize = settings.menu_fontsize
			theme_settings.posttitlecolor = settings.post_titlefontcolor
			theme_settings.posttitlefontsize = settings.post_titlefontsize
			theme_settings.postcontentcolor = settings.post_contentfontcolor
			theme_settings.postcontentfontsize = settings.post_contentfontsize
			theme_settings.pagetitlecolor = settings.page_titlefontcolor
			theme_settings.pagetitlefontsize = settings.page_titlefontsize
			theme_settings.pagecontentcolor = settings.page_contentfontcolor
			theme_settings.pagecontentfontsize = settings.page_contentfontsize
			var pageDetails = {
				title: "Mely - EDIT THEME",
				theme: theme_single,
				settings: theme_settings
			}
			reply.view("admin/theme/edit", pageDetails)
		})
	})
}

internals.themeEdit = function(request, reply){
	console.log(request.payload)
	var id = request.payload["id"]
	var name = request.payload["themename"]
	var desc = request.payload["themedescription"]
	var hbc = request.payload["headerbackcolor"]
	var hfc = request.payload["headerfontcolor"]
	var hfs = request.payload["headerfontsize"]
	var mbc = request.payload["menubackcolor"]
	var mfc = request.payload["menufontcolor"]
	var mfs = request.payload["menufontsize"]
	var potc = request.payload["posttitlecolor"]
	var potfs = request.payload["posttitlefontsize"]
	var pocc = request.payload["postcontentcolor"]
	var pocfs = request.payload["postcontentfontsize"]
	var patc = request.payload["pagetitlecolor"]
	var patfs = request.payload["pagetitlefontsize"]
	var pacc = request.payload["pagecontentcolor"]
	var pacfs = request.payload["pagecontentfontsize"]
 	models.Theme.find({ where: { id:id }}).success(function(theme) {
 		theme.updateAttributes({
 			theme_name: name,
 			theme_description: desc
 		}).success(function() {
			models.ThemeSetting.find({ where: { id:id }}).success(function(setting) {
				setting.updateAttributes({
					header_backgroundcolor: hbc,
					header_fontcolor: hfc,
					header_fontsize: hfs,
					menu_backgroundcolor: mbc,
					menu_fontcolor: mfc,
					menu_fontsize: mfs,
					post_titlefontcolor: potc,
					post_titlefontsize: potfs,
					post_contentfontcolor: pocc,
					post_contentfontsize: pocfs,
					page_titlefontcolor: patc,
					page_titlefontsize: patfs,
					page_contentfontcolor: pacc,
					page_contentfontsize: pacfs
				}).success(function() {
					reply().redirect("/admin/theme")
				})	
			})
 		})	
 	})
}

internals.markdown = function(request, reply){
	var content = request.payload["content"]
	reply(marked(content))
}

internals.themeActivate = function(request, reply){
	var systemID = request.auth.credentials.SystemId
	var themeID = parseInt(request.params["id"])
	models.Theme.findAll({
		where: {
			id:{
				ne: themeID
			},
			SystemId: systemID
		}
	}).success(function(themes){
		themes.forEach(function (theme) {
			theme.updateAttributes({
				theme_active: false
			});
		});
		models.Theme.find({
			where: {
				id: themeID,
				SystemId: systemID
			}
		}).success(function(theme){
			theme.updateAttributes({
				theme_active: true
			}).success(function() {
				reply().redirect("/admin/theme")
			});
		})
	})
}

internals.themeFiles = function(request, reply){
	
	var glob = require("glob")
	var fileList = []

	glob("lib/views/mely/*.html", {}, function (error, files) {
		for(var file in files){
			var fileObj = {}
			fileObj.name = changeCase.titleCase(files[file].replace("lib/views/mely/","").replace(".html",""))
			fileObj.link = files[file]
			fileList.push(fileObj)
		}
		glob("lib/views/partials/main/*.html", {}, function (error, files) {
			for(var file in files){
				var fileObj = {}
				fileObj.name = changeCase.titleCase(files[file].replace("lib/views/partials/main/","").replace(".html","")) 
				fileObj.link = files[file]
				fileList.push(fileObj)
			}
			var pageDetails = {
				title: "Mely - THEME FILES",
				fileList: fileList
			}
			reply.view("admin/file/index", pageDetails)
		})
	})	
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
exports.pageEditView = internals.pageEditView
exports.pageEdit = internals.pageEdit
exports.posts = internals.posts
exports.postNewView = internals.postNewView
exports.postCreate = internals.postCreate
exports.postEditView = internals.postEditView
exports.postEdit = internals.postEdit
exports.themes = internals.themes
exports.themeNewView = internals.themeNewView
exports.themeCreate = internals.themeCreate
exports.themeEditView = internals.themeEditView
exports.themeEdit = internals.themeEdit
exports.markdown = internals.markdown
exports.themeActivate = internals.themeActivate
exports.themeFiles = internals.themeFiles
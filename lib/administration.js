var models = require('./models');
var marked = require('marked');
var changeCase = require('change-case');
var glob = require("glob");
var fs = require("fs");

var Administrator = {};

Administrator.createSystem = function(input, callback){
	var errorMessages = [];
	var name = input.name;
	var description = input.description;
	models.System.create({
		name: name,
		description: description,
		status: true
	}).then(function(system){
		callback(null, system);
	}).catch(function(error){
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
};

Administrator.getSystem = function(input, callback){
	var errorMessages = [];
	models.System.find({
		status: true
	}).then(function(system){
		callback(null, system);
	}).catch(function(error){
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
};

Administrator.getSystemCount = function(input, callback){
	var errorMessages = [];
	models.System.count(
	).then(function(count){
		callback(null, count);
	}).catch(function(error){
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
};

Administrator.createUser = function(input, callback){
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

Administrator.getUser = function(input, callback){
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

Administrator.deleteUser = function(input, callback){
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

Administrator.loginUser = function(input, callback){
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

Administrator.resetPassword = function(input, callback){
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

Administrator.createPage = function(input, callback){
	var errorMessages = [];
	var title = input.title;
	var content = input.content;
	var status = input.status;
	var systemid = input.systemid;
	var userid = input.userid;
	var order = input.order;
	var menuview = input.menuview === true ? 1 : 0;
	if (systemid === undefined || userid === undefined){
		errorMessages.push("createPage() requires login");
		callback(new Error(errorMessages));
	}
	else{
		models.Page.create({
			title:title,
			content:content,
			SystemId:systemid,
			UserId:userid,
			status:status,
			ordernum:order,
			onmenu: menuview
		}).then(function(page) {
			callback(null, page);
		}).catch(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}
};

Administrator.getPage = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	var systemid = input.systemid;
	var status = input.status;
	var title = input.title;
	if(systemid === undefined){
		errorMessages.push("getPage() requires login");
		callback(new Error(errorMessages));
	}
	else{
		var whereClause = {
			where:{
				systemid: systemid,
				deleted: false
			},
			order: "status, ordernum"
		};
		if (id !== undefined){
			whereClause.where.id = id;
		}
		if (title !== undefined){
			whereClause.where.title = title;
		}
		if (status !== undefined){
			whereClause.where.status = status;
		}
		models.Page.findAll(whereClause
		).then(function(pages) {
			callback(null, pages);
		}).catch(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}
};

Administrator.updatePage = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	var title = input.title;
	var content = input.content;
	var status = input.status;
	var order = input.order;
	var menuview = input.menuview === true ? 1 : 0;
	models.Page.find({
		where:{
			id:id
		}
	}).then(function(page) {
		page.updateAttributes({
			title: title,
			content: content,
			status: status,
			ordernum: order,
			onmenu: menuview
		}).then(function(page) {
			callback(null,page);
		}).error(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}).catch(function(error){
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
};

Administrator.deletePage = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	models.Page.find({
		where:{
			id:id
		}
	}).then(function(page) {
		page.updateAttributes({
			deleted: 1
		}).then(function(page) {
			callback(null,page);
		}).catch(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}).catch(function(error){
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
};

Administrator.createPost = function(input, callback){
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

Administrator.updatePost = function(input, callback){
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

Administrator.getPost = function(input, callback){
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

Administrator.deletePost = function(input, callback){
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

Administrator.createTheme = function(input, callback){
	var errorMessages = [];
	var systemid = input.systemid;
	var name = input.name;
	var description = input.description;
	var headlogo = input.logo;
	var headback = input.headback;
	var headfontcolor = input.headfontcolor;
	var headfontsize = input.headfontsize;
	var menuback = input.menuback;
	var menufontcolor = input.menufontcolor;
	var menufontsize = input.menufontsize;
	var posttitlecolor = input.posttitlecolor;
	var posttitlesize = input.posttitlesize;
	var postcontentcolor = input.postcontentcolor;
	var postcontentsize = input.postcontentsize;
	var pagetitlecolor = input.pagetitlecolor;
	var pagetitlesize = input.pagetitlesize;
	var pagecontentcolor = input.pagecontentcolor;
	var pagecontentsize = input.pagecontentsize;
	if (systemid === undefined){
		errorMessages.push("createTheme() requires login");
		callback(new Error(errorMessages));
	}
	else{
		models.Theme.create({
			name: name,
			description: description,
			status: true,
			active: false,
			SystemId: systemid
		}).then(function(theme){
			var themeid = theme.id;
			models.ThemeSetting.create({
				headerfilename: headlogo,
				header_backgroundcolor: headback,
				header_fontcolor: headfontcolor,
				header_fontsize: headfontsize,
				menu_backgroundcolor: menuback,
				menu_fontcolor: menufontcolor,
				menu_fontsize: menufontsize,
				post_titlefontcolor: posttitlecolor,
				post_titlefontsize: posttitlesize,
				post_contentfontcolor: postcontentcolor,
				post_contentfontsize: postcontentsize,
				page_titlefontcolor: pagetitlecolor,
				page_titlefontsize: pagetitlesize,
				page_contentfontcolor: pagecontentcolor,
				page_contentfontsize: pagecontentsize,
				ThemeId: themeid
			}).then(function(themesetting){
				callback(null, themesetting);
			}).catch(function(error){
				errorMessages.push(error);
				callback(new Error(errorMessages));
			});
		}).catch(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}
};

Administrator.getTheme = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	var systemid = input.systemid;
	var active = input.active;
	if(systemid === null){
		errorMessages.push("getTheme() requires login");
		callback(new Error(errorMessages));
	}
	else{
		var whereClause = {
			where:{
				systemid: systemid,
				status: true
			}
		};
		if (id !== undefined){
			whereClause.where.id = id;
		}
		if (active !== undefined){
			whereClause.where.active = active;
		}
		models.Theme.findAll(whereClause
		).then(function(themes){
			callback(null, themes);
		}).catch(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}
};

Administrator.getThemeSetting = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	models.ThemeSetting.findAll({
		where:{
			ThemeId: id
		}
	}).then(function(themesettings){
		callback(null, themesettings);
	}).catch(function(error){
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
};

Administrator.updateTheme = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	var name = input.name;
	var description = input.description;
	var headlogo = input.logo;
	var headback = input.headback;
	var headfontcolor = input.headfontcolor;
	var headfontsize = input.headfontsize;
	var menuback = input.menuback;
	var menufontcolor = input.menufontcolor;
	var menufontsize = input.menufontsize;
	var posttitlecolor = input.posttitlecolor;
	var posttitlesize = input.posttitlesize;
	var postcontentcolor = input.postcontentcolor;
	var postcontentsize = input.postcontentsize;
	var pagetitlecolor = input.pagetitlecolor;
	var pagetitlesize = input.pagetitlesize;
	var pagecontentcolor = input.pagecontentcolor;
	var pagecontentsize = input.pagecontentsize;
	models.Theme.find({
		where:{
			id: id
		}
	}).then(function(theme){
		theme.updateAttributes({
			name: name,
			description: description
		}).then(function(){
			models.ThemeSetting.find({
				where:{
					ThemeId: id
				}
			}).then(function(setting){
				setting.updateAttributes({
					headerfilename: headlogo,
					header_backgroundcolor: headback,
					header_fontcolor: headfontcolor,
					header_fontsize: headfontsize,
					menu_backgroundcolor: menuback,
					menu_fontcolor: menufontcolor,
					menu_fontsize: menufontsize,
					post_titlefontcolor: posttitlecolor,
					post_titlefontsize: posttitlesize,
					post_contentfontcolor: postcontentcolor,
					post_contentfontsize: postcontentsize,
					page_titlefontcolor: pagetitlecolor,
					page_titlefontsize: pagetitlesize,
					page_contentfontcolor: pagecontentcolor,
					page_contentfontsize: pagecontentsize
				}).then(function(themesetting){
					callback(null, themesetting);
				}).catch(function(error){
					errorMessages.push(error);
					callback(new Error(errorMessages));
				});
			}).catch(function(error){
				errorMessages.push(error);
				callback(new Error(errorMessages));
			});
		}).catch(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}).catch(function(error){
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
};

Administrator.activateTheme = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	var systemid = input.systemid;
	if (systemid === undefined){
		errorMessages.push("activateTheme() requires login");
		callback(new Error(errorMessages));
	}
	else{
		models.Theme.findAll({
			where:{
				id:{
					ne: id
				},
				SystemId: systemid
			}
		}).then(function(themes){
			themes.forEach(function (theme) {
				theme.updateAttributes({
					active: false
				});
			});
		});
		models.Theme.find({
			where:{
				id: id,
				SystemId: systemid
			}
		}).then(function(theme){
			theme.updateAttributes({
				active: true
			}).then(function(theme){
				callback(null, theme);
			}).catch(function(error){
				errorMessages.push(error);
				callback(new Error(errorMessages));
			});
		}).catch(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}
};

Administrator.getThemeFiles = function(input, callback){
	var errorMessages = [];
	var fileList = [];
	glob("lib/views/mely/*.html", {}, function (error, files) {
		if (error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		}
		else{
			for(var file in files){
				if (files.hasOwnProperty(file)){
					var fileObj = {};
					fileObj.name = changeCase.titleCase(files[file].replace("lib/views/mely/","").replace(".html",""));
					fileList.push(fileObj);
				}
			}
			glob("lib/views/partials/*.html", {}, function (error, files) {
				if (error){
					errorMessages.push(error);
					callback(new Error(errorMessages));
				}
				else{
					for(var file in files){
						if (files.hasOwnProperty(file)){							
							if(files[file].indexOf("blog-") !== -1){
								var fileObj = {};
								fileObj.name = changeCase.titleCase(files[file].replace("lib/views/partials/","").replace(".html",""));
								fileList.push(fileObj);
							}
						}	
					}
					callback(null, fileList);
				}
			});
		}
	});
};

Administrator.getFileContents = function(input, callback){
	var errorMessages = [];
	var file = input.id.replace(" ","-");
	glob("lib/views/partials/" + file + ".html", {}, function(error, files){
		if(files.length !== 0){
			fs.readFile(files[0], 'utf8', function (err,data) {
				if (err) {
					errorMessages.push(error);
					callback(new Error(errorMessages));
				}
				else{
					callback(null, [data,file]);
				}
			});
		}
		else{
			glob("lib/views/mely/" + file + ".html", {}, function(error, files){
				if(files.length !== 0){
					fs.readFile(files[0], 'utf8', function (err,data) {
						if (err) {
							errorMessages.push(error);
							callback(new Error(errorMessages));
						}
						else{
							callback(null, [data,file]);
						}
					});
				}
				else{
					callback(null, ["","unknown"])
				}
			});
		}
	});
};

Administrator.writeFileContents = function(input, callback){
	var errorMessages = [];
	var filename = input.filename.replace(" ","-");
	var content = input.content;
	glob("lib/views/partials/" + filename + ".html", {}, function(error, files){
		if(files.length !== 0){
			fs.writeFile("lib/views/partials/" + filename + ".html", content, function(err){
				if (err) throw err;
				callback(null, "success");
			});
		}
		else{
			callback(null, "file does not exist");
		}
	});
};

Administrator.createComment = function(input, callback){
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

Administrator.approveComment = function(input, callback){
	var errorMessages = [];
	var commentid = input.commentid;
	var direction = input.direction;
	models.Comment.find({
		where:{
			id:commentid
		}
	}).then(function(comment) {
		comment.updateAttributes({
			approved: direction === 'true' ? true : false
		}).then(function(comment) {
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

Administrator.getComment = function(input, callback){
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

Administrator.upComment = function(input, callback){
	var errorMessages = [];
	var commentid = input.commentid;
	models.Comment.find({
		where:{
			id: commentid
		}
	}).then(function(comment){
		var currentVotes = comment.upvote;
		comment.updateAttributes({
			upvote: currentVotes + 1
		}).then(function(comment) {
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

Administrator.downComment = function(input, callback){
	var errorMessages = [];
	var commentid = input.commentid;
	models.Comment.find({
		where:{
			id: commentid
		}
	}).then(function(comment){
		var currentVotes = comment.downvote;
		comment.updateAttributes({
			downvote: currentVotes + 1
		}).then(function(comment) {
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

module.exports = Administrator;
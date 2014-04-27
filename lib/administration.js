var internals = {};
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
	if (name === null || description === null){
		errorMessages.push('System needs name and description');
		callback(new Error(errorMessages));
	}
	else{
		models.System.create({
			name: name,
			description: description,
			status: true
		}).success(function(system){
			callback(null, system);
		}).error(function(error){
			errorMessages.push('System create failed');
			callback(new Error(errorMessages));
		});
	}
};

Administrator.getSystem = function(input, callback){
	var errorMessages = [];
	models.System.find({
		status: true
	}).success(function(system){
		callback(null, system);
	}).error(function(error){
		errorMessages.push('Cannot find system');
		callback(new Error(errorMessages));
	});
};

Administrator.getSystemCount = function(input, callback){
	var errorMessages = [];
	models.System.count()
	.success(function(count){
		callback(null, count);
	}).error(function(error){
		errorMessages.push('System count failed');
		callback(new Error(errorMessages));
	});
};

Administrator.createUser = function(input, callback){
	var errorMessages = [];
	var email = input.email;
	var password = input.password;
	var systemid = input.systemid;
	if (systemid === null){
		errorMessages.push('SystemId must not be null');
		callback(new Error(errorMessages));
	}
	else{
		models.User.create({
			email_address: email,
			password: password,
			status: true,
			SystemId:systemid
		}).success(function(user) {
			callback(null, user);
		}).error(function(error){
			errorMessages.push('The user does not exist.');
			callback(new Error(errorMessages));
		});
	}
};

Administrator.getUser = function(input, callback){
	var errorMessages = [];
	var systemid = input.systemid;
	var id = input.id;
	var whereClause = {
		where:{}
	};
	whereClause.where.status = true;
	whereClause.where.systemid = systemid;
	if (id !== undefined){
		whereClause.where.id = id;
	}
	if (systemid === null){
		errorMessages.push('SystemId must not be null');
		callback(new Error(errorMessages));
	}
	else{
		models.User.findAll(whereClause).success(function(users) {
			callback(null, users);
		}).error(function(error){
			errorMessages.push('No Users.');
			callback(new Error(errorMessages));
		});
	}
};

Administrator.updateUser = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	var email = input.email;
	if (id === null){
		errorMessages.push('UserID cannot be null');
		callback(new Error(errorMessages));
	}
	else{
		models.User.find({
			where:{
				id:id
			}
		}).success(function(user) {
			user.updateAttributes({
				email_address: email
			}).success(function(user) {
				callback(null, user);
			}).error(function(error){
				errorMessages.push('Cannot update user attributes');
				callback(new Error(errorMessages));
			});
		});
	}
};

Administrator.deleteUser = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	if (id === null){
		errorMessages.push('UserID cannot be null');
		callback(new Error(errorMessages));
	}
	else
	{
		models.User.find({
			where:{
				id:id
			}
		}).success(function(user) {
			user.updateAttributes({
				status: false
			}).success(function(deleted) {
				callback(null, deleted);
			}).error(function(error){
				errorMessages.push('Cannot set user to deleted');
				callback(new Error(errorMessages));
			});
		}).error(function(error){
			errorMessages.push('Cannot find user');
			callback(new Error(errorMessages));
		});
	}
};

Administrator.loginUser = function(input, callback){
	var errorMessages = [];
	var email = input.email;
	var password = input.password;
	if(email === null || password === null){
		errorMessages.push('email and password must not be null');
		callback(new Error(errorMessages));
	}
	else{
		models.User.find({
			where:{
				email_address: email,
				password: password
			},
			attributes:[
				"id",
				"email_address",
				"SystemId"
			]
		}).success(function(user){
			callback(null, user);
		}).error(function(error){
			errorMessages.push('cannot find user');
			callback(new Error(errorMessages));
		});
	}
};

Administrator.createPage = function(input, callback){
	var errorMessages = [];
	var title = input.title;
	var content = input.content;
	var status = input.status;
	var systemid = input.systemid;
	var userid = input.userid;
	var order = input.order;
	if (systemid === null || status === null || userid === null || order === null){
		errorMessages.push('Missing fields for page');
		callback(new Error(errorMessages));
	}
	else{
		models.Page.create({
			title:title,
			content:content,
			SystemId:systemid,
			UserId:userid,
			StatuId:status,
			ordernum:order
		}).success(function(page) {
			callback(null, page);
		}).error(function(error){
			errorMessages.push('Cannot create page');
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
	var whereClause = {
		where:{},
		order: "StatuId, ordernum"
	};
	whereClause.where.systemid = systemid;
	if (id !== undefined){
		whereClause.where.id = id;
	}
	if (title !== undefined){
		whereClause.where.title = title;
	}
	if (status !== undefined){
		whereClause.where.StatuId = status;
	}
	if (systemid === null){
		errorMessages.push('systemid must not be null');
		callback(new Error(errorMessages));
	}
	else{
		models.Page.findAll(whereClause
		).success(function(pages) {
			callback(null, pages);
		}).error(function(error){
			errorMessages.push('No pages.');
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
	if(id !== null){
		if(status === null || content === null || title === null){
			errorMessages.push('No status or content or title was provided');
			callback(new Error(errorMessages));
		}
		else{
			models.Page.find({
				where:{
					id:id
				}
			}).success(function(page) {
				page.updateAttributes({
					title: title,
					content: content,
					StatuId: status,
					ordernum:order
				}).success(function(page) {
					callback(null,page);
				}).error(function(){
					errorMessages.push('Cannot update page');
					callback(new Error(errorMessages));
				});
			}).error(function(){
				errorMessages.push('Cannot find page');
				callback(new Error(errorMessages));
			});
		}
	}
	else{
		errorMessages.push('No pageid was provided');
		callback(new Error(errorMessages));
	}
};

Administrator.createPost = function(input, callback){
	var errorMessages = [];
	var title = input.title;
	var content = input.content;
	var status = input.status;
	var systemid = input.systemid;
	var userid = input.userid;
	if (systemid === null || status === null || userid === null){
		errorMessages.push('Missing fields for post');
		callback(new Error(errorMessages));
	}
	else{
		models.Post.create({
			title:title,
			content:content,
			SystemId:systemid,
			UserId:userid,
			StatuId:status
		}).success(function(post) {
			callback(null, post);
		}).error(function(error){
			errorMessages.push('Cannot create post');
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
	if(id !== null){
		if(status === null || content === null || title === null){
			errorMessages.push('No status or content or title was provided');
			callback(new Error(errorMessages));
		}
		else{
			models.Post.find({
				where:{
					id:id
				}
			}).success(function(post) {
				post.updateAttributes({
					title: title,
					content: content,
					StatuId: status
				}).success(function(post) {
					callback(null,post);
				}).error(function(){
					errorMessages.push('Cannot update post');
					callback(new Error(errorMessages));
				});
			}).error(function(){
				errorMessages.push('Cannot find post');
				callback(new Error(errorMessages));
			});
		}
	}
	else{
		errorMessages.push('No postid was provided');
		callback(new Error(errorMessages));
	}
};

Administrator.getPost = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	var systemid = input.systemid;
	var status = input.status;
	var whereClause = {
		where:{},
		order: "id DESC"
	};
	whereClause.where.systemid = systemid;
	if (id !== undefined){
		whereClause.where.id = id;
	}
	if (status !== undefined){
		whereClause.where.StatuId = status;
	}
	if (systemid === null){
		errorMessages.push('systemid must not be null');
		callback(new Error(errorMessages));
	}
	else{
		models.Post.findAll(whereClause
		).success(function(posts) {
			callback(null, posts);
		}).error(function(error){
			errorMessages.push('No posts.');
			callback(new Error(errorMessages));
		});
	}
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
	if (systemid === null){
		errorMessages.push('systemid must not be null');
		callback(new Error(errorMessages));
	}
	else{
		models.Theme.create({
			name: name,
			description: description,
			status: true,
			active: false,
			SystemId: systemid
		}).success(function(theme){
			var themeid = theme.id;
			models.ThemeSetting.create({
				header_logo: headlogo,
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
			}).success(function(themesetting){
				callback(null, themesetting);
			}).error(function(error){
				errorMessages.push('can not create theme setting');
				callback(new Error(errorMessages));
			});
		}).error(function(error){
			errorMessages.push('can not create theme');
			callback(new Error(errorMessages));
		});
	}
};

Administrator.getTheme = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	var systemid = input.systemid;
	var active = input.active;
	var whereClause = {
		where:{}
	};
	whereClause.where.systemid = systemid;
	if (id){
		whereClause.where.id = id;
	}
	if (active){
		whereClause.where.active = active;
	}
	models.Theme.findAll(whereClause)
	.success(function(themes){
		callback(null, themes);
	}).error(function(error){
		errorMessages.push("can not find theme");
		callback(new Error(errorMessages));
	});
};

Administrator.getThemeSetting = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	if (id){
		models.ThemeSetting.findAll({
			where:{
				ThemeId: id
			}
		}).success(function(themesettings){
			callback(null, themesettings);
		}).error(function(error){
			errorMessages.push("can not find theme settings");
			callback(new Error(errorMessages));
		});
	}
	else{
		errorMessages.push("theme id must be provided");
		callback(new Error(errorMessages));
	}
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
	if(id !== null){
		if(name === null || description === null){
			errorMessages.push('name or description cannnot be null');
			callback(new Error(errorMessages));
		}
		else{
			models.Theme.find({
				where:{
					id: id
				}
			}).success(function(theme){
				theme.updateAttributes({
					name: name,
					description: description
				}).success(function(updatedTheme){
					models.ThemeSetting.find({
						where:{
							ThemeId: id
						}	
					}).success(function(setting){
						setting.updateAttributes({
							header_logo: headlogo,
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
						}).success(function(themesetting){
							callback(null, themesetting);
						}).error(function(error){
							errorMessages.push("can not update theme setting");
							callback(new Error(errorMessages));
						});
					}).error(function(error){
						errorMessages.push("can not find theme setting");
						callback(new Error(errorMessages));
					});
				}).error(function(error){
					errorMessages.push("can not update theme");
					callback(new Error(errorMessages));
				});
			}).error(function(error){
				errorMessages.push("cannot find theme");
				callback(new Error(errorMessages));
			});
		}	
	}
	else{
		errorMessages.push('id must not be null');
		callback(new Error(errorMessages));
	}
};

Administrator.activateTheme = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	var systemid = input.systemid;
	if (id === null || systemid === null){
		errorMessages.push("can not set active theme without id");
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
		}).success(function(themes){
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
		}).success(function(theme){
			theme.updateAttributes({
				active: true
			}).success(function(theme){
				callback(null, theme);
			}).error(function(error){
				errorMessages.push("can not activate theme");
				callback(new Error(errorMessages));
			});
		}).error(function(error){
			errorMessages.push("can not find theme to activate");
			callback(new Error(errorMessages));
		});
	}
};

Administrator.parseMarkdown = function(input, callback){
	var errorMessages = [];
	var markdown = input.content;
	if (markdown !== null){
		callback(null, marked(markdown));
	}
	else{
		errorMessages.push("No content to parse");
		callback(new Error(errorMessages));
	}
};

Administrator.getStatus = function(input, callback){
	var errorMessages = [];
	models.Status.findAll(
	).success(function(status){
		callback(null, status);
	}).error(function(error){
		errorMessages.push("cannot find statuses");
		callback(new Error(errorMessages));
	});
};

Administrator.getThemeFiles = function(input, callback){
	var errorMessages = [];
	var fileList = [];
	glob("lib/views/mely/*.html", {}, function (error, files) {
		if (error){
			errorMessages.push("cannot find main file");
			callback(new Error(errorMessages));
		}
		else{
			for(var file in files){
				var fileObj = {};
				fileObj.name = changeCase.titleCase(files[file].replace("lib/views/mely/","").replace(".html",""));
				fileList.push(fileObj);
			}
			glob("lib/views/partials/main/*.html", {}, function (error, files) {
				if (error){
					errorMessages.push("cannot find section files");
					callback(new Error(errorMessages));
				}
				else{
					for(var file in files){
						var fileObj = {};
						fileObj.name = changeCase.titleCase(files[file].replace("lib/views/partials/main/","").replace(".html",""));
						fileObj.type = "Subset"
						fileList.push(fileObj);
					}
					callback(null, fileList);
				}
			});
		}
	});
};

Administrator.getFileContents = function(input, callback){
	var errorMessages = [];
	var file = input.id;
	glob("lib/views/partials/main/" + file + ".html", {}, function(error, files){
		if(files.length !== 0){
			fs.readFile(files[0], 'utf8', function (err,data) {
				if (err) {
					return console.log(err);
				}
				callback(null, [data,file]);
			});
		}
		else{
			glob("lib/views/mely/" + file + ".html", {}, function(error, files){
				if(files.length !== 0){
					fs.readFile(files[0], 'utf8', function (err,data) {
						if (err) {
							return console.log(err);
						}
						callback(null, [data,file]);
					});
				}
			});
		}
	})
};

module.exports = Administrator;
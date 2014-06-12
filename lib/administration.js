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
	if (name === undefined || description === undefined){
		errorMessages.push("createSystem() requires name and description fields");
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
			errorMessages.push(error);
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
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
};

Administrator.getSystemCount = function(input, callback){
	var errorMessages = [];
	models.System.count(
	).success(function(count){
		callback(null, count);
	}).error(function(error){
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
};

Administrator.createUser = function(input, callback){
	var errorMessages = [];
	var email = input.email;
	var password = input.password;
	var systemid = input.systemid;
	if (systemid === undefined || email === undefined || password === undefined){
		errorMessages.push("createUser() requires SystemID, Email and Password");
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
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}
};

Administrator.getUser = function(input, callback){
	var errorMessages = [];
	var systemid = input.systemid;
	var id = input.userid;
	if(systemid === undefined){
		errorMessages.push("getUser() requires SystemID");
		callback(new Error(errorMessages));
	}
	else{
		var whereClause = {
			where:{
				status: true,
				systemid: systemid
			}
		};
		if(id !== undefined){
			whereClause.where.id = id;
		}
		models.User.findAll(whereClause).success(function(users) {
			callback(null, users);
		}).error(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}
};

Administrator.updateUser = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	var email = input.email;
	if (id === undefined){
		errorMessages.push("updateUser() requires userid");
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
				errorMessages.push(error);
				callback(new Error(errorMessages));
			});
		});
	}
};

Administrator.deleteUser = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	if (id === undefined){
		errorMessages.push("deleteUser() requires UserID");
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
				errorMessages.push(error);
				callback(new Error(errorMessages));
			});
		}).error(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}
};

Administrator.loginUser = function(input, callback){
	var errorMessages = [];
	var email = input.email;
	var password = input.password;
	if(email === undefined || password === undefined){
		errorMessages.push("loginUser() requires email and password");
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
			errorMessages.push(error);
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
	var menuview = input.menuview;
	if (systemid === undefined || status === undefined || userid === undefined || order === undefined || content === undefined || title === undefined || menuview === undefined){
		errorMessages.push("createPage() requires SystemID, UserID, Status, Title, Content, MenuView and Order");
		callback(new Error(errorMessages));
	}
	else{
		if(menuview === "1"){
			menuview = true;
		}
		else{
			menuview = false;
		}
		models.Page.create({
			title:title,
			content:content,
			SystemId:systemid,
			UserId:userid,
			StatuId:status,
			ordernum:order,
			onmenu: menuview
		}).success(function(page) {
			callback(null, page);
		}).error(function(error){
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
		errorMessages.push("getPage() requires SystemID");
		callback(new Error(errorMessages));
	}
	else{
		var whereClause = {
			where:{
				systemid: systemid
			},
			order: "StatuId, ordernum"
		};
		if (id !== undefined){
			whereClause.where.id = id;
		}
		if (title !== undefined){
			whereClause.where.title = title;
		}
		if (status !== undefined){
			whereClause.where.StatuId = status;
		}
		models.Page.findAll(whereClause
		).success(function(pages) {
			callback(null, pages);
		}).error(function(error){
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
	var menuview = input.menuview;
	if(id === undefined || status === undefined || content === undefined || title === undefined || order === undefined || menuview === undefined){
		errorMessages.push("updatePage() requires pageid, content, title, order, menuview and status");
		callback(new Error(errorMessages));
	}
	else{
		if(menuview === "1"){
			menuview = true;
		}
		else{
			menuview = false;
		}
		models.Page.find({
			where:{
				id:id
			}
		}).success(function(page) {
			page.updateAttributes({
				title: title,
				content: content,
				StatuId: status,
				ordernum: order,
				onmenu: menuview
			}).success(function(page) {
				callback(null,page);
			}).error(function(error){
				errorMessages.push(error);
				callback(new Error(errorMessages));
			});
		}).error(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}
};

Administrator.createPost = function(input, callback){
	var errorMessages = [];
	var title = input.title;
	var content = input.content;
	var status = input.status;
	var systemid = input.systemid;
	var userid = input.userid;
	if (systemid === undefined || status === undefined || userid === undefined || title === undefined || content === undefined){
		errorMessages.push("createPost() requires SystemID, UserID, Title. Status and Content");
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
	if (id === undefined || status === undefined || title === undefined || content === undefined){
		errorMessages.push("updatePost() requires ID, Title, Status, Content");
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
			}).error(function(error){
				errorMessages.push(error);
				callback(new Error(errorMessages));
			});
		}).error(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}
};

Administrator.getPost = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	var systemid = input.systemid;
	var status = input.status;
	if(systemid === undefined){
		errorMessages.push("getPost() requires SystemID");
		callback(new Error(errorMessages));
	}
	else{
		var whereClause = {
			where:{
				systemid: systemid
			},
			order: "id DESC"
		};
		if (id !== undefined){
			whereClause.where.id = id;
		}
		if (status !== undefined){
			whereClause.where.StatuId = status;
		}
		models.Post.findAll(whereClause
		).success(function(posts) {
			callback(null, posts);
		}).error(function(error){
			errorMessages.push(error);
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
	if (systemid === undefined || name === undefined || description === undefined || headback === undefined || headfontcolor === undefined || headfontsize === undefined || menuback === undefined || menufontcolor === undefined || menufontsize === undefined || posttitlecolor === undefined|| posttitlesize === undefined|| postcontentcolor === undefined || postcontentsize === undefined || pagetitlecolor === undefined || pagetitlesize === undefined || pagecontentcolor === undefined || pagecontentsize === undefined){
		errorMessages.push("createTheme() requires SystemID, Name, Description, Header Background Color, Header Font Color, Header Font Size, Menu Background Color, Menu Font Color, Menu Font Size, Post Title Color, Post Title Font Size, Post Content Font Color, Post Content Font Size, Page Title Color, Page Title Font Size, Page Content Font Color, Page Content Font Size");
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
				errorMessages.push(error);
				callback(new Error(errorMessages));
			});
		}).error(function(error){
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
		errorMessages.push("getTheme() requires systemid");
		callback(new Error(errorMessages));
	}
	else{
		var whereClause = {
			where:{
				systemid: systemid
			}
		};
		if (id !== undefined){
			whereClause.where.id = id;
		}
		if (active !== undefined){
			whereClause.where.active = active;
		}
		models.Theme.findAll(whereClause
		).success(function(themes){
			callback(null, themes);
		}).error(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}
};

Administrator.getThemeSetting = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	if(id === undefined){
		errorMessages.push("getThemeSetting() requires themeid");
		callback(new Error(errorMessages));
	}
	else{
		models.ThemeSetting.findAll({
			where:{
				ThemeId: id
			}
		}).success(function(themesettings){
			callback(null, themesettings);
		}).error(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
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
	if (id === undefined || name === undefined || description === undefined || headback === undefined || headfontcolor === undefined || headfontsize === undefined || menuback === undefined || menufontcolor === undefined || menufontsize === undefined || posttitlecolor === undefined|| posttitlesize === undefined|| postcontentcolor === undefined || postcontentsize === undefined || pagetitlecolor === undefined || pagetitlesize === undefined || pagecontentcolor === undefined || pagecontentsize === undefined){
		errorMessages.push("updateTheme() requires ThemeID, Name, Description, Header Background Color, Header Font Color, Header Font Size, Menu Background Color, Menu Font Color, Menu Font Size, Post Title Color, Post Title Font Size, Post Content Font Color, Post Content Font Size, Page Title Color, Page Title Font Size, Page Content Font Color, Page Content Font Size");
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
						errorMessages.push(error);
						callback(new Error(errorMessages));
					});
				}).error(function(error){
					errorMessages.push(error);
					callback(new Error(errorMessages));
				});
			}).error(function(error){
				errorMessages.push(error);
				callback(new Error(errorMessages));
			});
		}).error(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}
};

Administrator.activateTheme = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	var systemid = input.systemid;
	if (id === undefined || systemid === undefined){
		errorMessages.push("activateTheme() SystemID and ThemeID");
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
				errorMessages.push(error);
				callback(new Error(errorMessages));
			});
		}).error(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}
};

Administrator.parseMarkdown = function(input, callback){
	var errorMessages = [];
	var content = input.content;
	if(content === undefined){
		errorMessages.push("parseMarkdown() requires content");
		callback(new Error(errorMessages));
	}
	else{
		callback(null, marked(content));
	}
};

Administrator.getStatus = function(input, callback){
	var errorMessages = [];
	models.Status.findAll(
	).success(function(status){
		callback(null, status);
	}).error(function(error){
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
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
				var fileObj = {};
				fileObj.name = changeCase.titleCase(files[file].replace("lib/views/mely/","").replace(".html",""));
				fileList.push(fileObj);
			}
			glob("lib/views/partials/main/*.html", {}, function (error, files) {
				if (error){
					errorMessages.push(error);
					callback(new Error(errorMessages));
				}
				else{
					for(var file in files){
						var fileObj = {};
						fileObj.name = changeCase.titleCase(files[file].replace("lib/views/partials/main/","").replace(".html",""));
						fileObj.type = "Subset";
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
			});
		}
	});
};

module.exports = Administrator;
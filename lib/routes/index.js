var crypto = require('crypto');
var moment = require('moment');
var async = require('async');
var marked = require('marked');
var changeCase = require('change-case');
var Mely = {};
var pageDetails = {};
var administration = require("../administration");
Mely.Administrator = administration;

exports.routes = [
{
	method: "GET",
	path: "/welcome",
	config:{
		handler: function(request, reply){
			Mely.Administrator.getSystemCount({
			}, function(err, count){
				if(count > 0){
					reply().redirect("/login");
				}
				else{
					pageDetails.title = "Welcome to Mely!";
					reply.view("welcome",pageDetails);
				}
			});
		},
		auth: false
	}
},
{
	method: "POST",
	path: "/welcome",
	config:{
		handler: function(request, reply){
			Mely.Administrator.createSystem({
				name: request.payload["mely-name"],
				description: request.payload["mely-description"]
			}, function(err, system){
				if(err){
					throw err;
				}
				Mely.Administrator.createUser({
					email: request.payload["mely-email"],
					password: crypto.createHash('sha256').update(request.payload["mely-password"]).digest("hex"),
					systemid: system.id
				}, function(err, user){
					if(err){
						throw err;
					}
					if(user !== undefined){
						Mely.Administrator.createTheme({
							systemid: system.id,
							name: "Default Theme",
							description: "Mely Default Theme",
							headback: "FFFFFF",
							headfontcolor: "000000",
							headfontsize: 12,
							logo: "Blank.gif",
							menuback: "FFFFFF",
							menufontcolor: "000000",
							menufontsize: 12,
							posttitlecolor: "000000",
							posttitlesize: 12,
							postcontentcolor: "000000",
							postcontentsize: 12,
							pagetitlecolor: "000000",
							pagetitlesize: 12,
							pagecontentcolor: "000000",
							pagecontentsize: 12
						}, function(err, theme){
							if(err){
								throw err;
							}
							Mely.Administrator.activateTheme({
								systemid: system.id,
								id: theme.ThemeId
							}, function(err, theme){
								if(err){
									throw err;
								}
								if(theme !== undefined){
									reply().redirect("/login");
								}
							});
						});
					}
				});
			});
		},
		auth: false
	}
},
{
	method: "GET",
	path: "/login",
	config:{
		handler: function(request, reply){
			var session = request.auth.credentials;
			if (!session){
				pageDetails.title = "Mely:Login";
				reply.view("login/index", pageDetails);
			}
			else{
				reply().redirect("/admin");
			}
		},
		auth:{
			mode: "try"
		}
	}
},
{
	method: "POST",
	path: "/login",
	config:{
		handler: function(request,reply){
			Mely.Administrator.loginUser({
				email: request.payload["mely-email"],
				password: crypto.createHash('sha256').update(request.payload["mely-password"]).digest("hex")
			}, function(err, user){
				if(err){
					throw err;
				}
				if(user !== null){
					request.auth.session.set(user.dataValues);
					reply().redirect("/admin");
				}
				else{
					reply().redirect("/login?invalid");
				}
			});
		},
		auth: false
	}
},
{
	method: "GET",
	path: "/logout",
	config:{
		handler: function(request, reply){
			request.auth.session.clear();
			reply().redirect("/login");
		},
		auth: false
	}
},
{
	method: "GET",
	path: "/admin",
	config:{
		handler: function(request, reply){
			pageDetails.title = "Mely:Admin";
			reply.view("admin/index", pageDetails);
		}
	}
},
{
	method: "GET",
	path: "/admin/user",
	config:{
		handler: function(request, reply){
			Mely.Administrator.getUser({
				systemid: request.auth.credentials.SystemId
			}, function(err, users){
				if(err){
					throw err;
				}
				var userList = [];
				for(var user in users){
					if (users.hasOwnProperty(user)) {
						var row = {};
						row.userid = users[user].id;
						row.email = users[user].email_address;
						row.createdDate = moment(users[user].createdAt).format('MMMM Do YYYY, h:mm:ss a');
						row.updatedDate = moment(users[user].updatedAt).format('MMMM Do YYYY, h:mm:ss a');
						if (users[user].status){
							row.status = "Active";
						}
						else{
							row.status = "Inactive";
						}
						userList.push(row);
					}
				}
				pageDetails.title = "Mely:Users";
				pageDetails.userList = userList;
				reply.view("admin/user/index", pageDetails);
			});
		}
	}
},
{
	method: "POST",
	path: "/admin/user",
	config:{
		handler: function(request, reply){
			Mely.Administrator.createUser({
				email: request.payload["mely-email"],
				password: crypto.createHash('sha256').update(request.payload["mely-password"]).digest("hex"),
				systemid: request.auth.credentials.SystemId
			}, function(err, user){
				if(err){
					throw err;
				}
				if(user !== undefined){
					reply().redirect("/admin/user");
				}
			});
		} 
	}
},
{
	method: "GET",
	path: "/admin/user/new",
	config:{
		handler: function(request, reply){
			var pageDetails = {};
			pageDetails.title = "Mely:New User";
			pageDetails.type = "New";
			reply.view("admin/user/form/index", pageDetails);
		}
	}
},
{
	method: "GET",
	path: "/admin/user/{id}",
	config:{
		handler: function(request, reply){
			var pageDetails = {};
			Mely.Administrator.getUser({
				systemid: request.auth.credentials.SystemId,
				userid: request.params.id
			}, function(err, users){
				if(err){
					throw err;
				}
				pageDetails.title = "Mely:Edit User";
				pageDetails.user = {};
				pageDetails.user.userid = users[0].id;
				pageDetails.user.email = users[0].email_address;
				pageDetails.type = "Edit";
				reply.view("admin/user/form/index", pageDetails);
			});
		}
	}
},
{
	method: "POST",
	path: "/admin/user/{id}",
	config:{
		handler: function(request, reply){
			Mely.Administrator.updateUser({
				id: request.payload["mely-userid"],
				email: request.payload["mely-email"]
			}, function(err, user){
				if(err){
					throw err;
				}
				if(user !== undefined){
					reply().redirect("/admin/user");
				}
			});
		}
	}
},
{
	method: "DELETE",
	path: "/admin/user/{id}",
	config:{
		handler: function(request, reply){
			Mely.Administrator.deleteUser({
				id: request.params.id
			}, function(err, user){
				if(err){
					throw err;
				}
				if(user !== undefined){
					reply("deleted");
				}
			});
		}
	}
},
{
	method: "GET",
	path: "/admin/page",
	config:{
		handler: function(request, reply){
			Mely.Administrator.getPage({
				systemid: request.auth.credentials.SystemId
			}, function(err, pages){
				var pageList = [];
				for(var page in pages){
					if (pages.hasOwnProperty(page)) {
						var row = {};
						row.pageId = pages[page].id;
						row.title = pages[page].title;
						row.order = pages[page].ordernum;
						row.onmenu = pages[page].onmenu;
						row.link = changeCase.lowerCase(pages[page].title.replace(" ","_"));
						switch(pages[page].StatuId){
							case 1:
								row.status = "Published";
								break;
							case 2:
								row.status = "Draft";
								break;
							case 3:
								row.status = "Deleted";
								break;
						}
						pageList.push(row);
					}
				}
				pageDetails.title = "Mely:Pages";
				pageDetails.pageList = pageList;
				reply.view("admin/page/index", pageDetails);
			});
		}
	}
},
{
	method: "POST",
	path: "/admin/page",
	config:{
		handler: function(request, reply){
			Mely.Administrator.createPage({
				title:request.payload["mely-page-title"],
				content:request.payload["mely-page-content"],
				systemid:request.auth.credentials.SystemId,
				userid:request.auth.credentials.id,
				status:request.payload["mely-page-status"],
				order:request.payload["page-order"],
				menuview:request.payload["mely-page-menuview"]
			},function(err,page){
				if(err){
					throw err;
				}
				if(page !== undefined){
					reply().redirect("/admin/page");
				}
			});
		}
	}
},
{
	method: "GET",
	path: "/admin/page/new",
	config:{
		handler: function(request, reply){
			var pageDetails = {};
			Mely.Administrator.getStatus({
			}, function(err, statuses){
				var statusList = [];
				for(var status in statuses){
					if (statuses.hasOwnProperty(status)) {
						var row = {};
						row.statusID = statuses[status].id;
						row.statusName = statuses[status].name;
						statusList.push(row);
					}
				}
				pageDetails.title = "Mely:New Page";
				pageDetails.statusList = statusList;
				pageDetails.type = "New";
				reply.view("admin/page/form/index", pageDetails);
			});
		}
	}
},
{
	method: "GET",
	path: "/admin/page/{id}",
	config:{
		handler: function(request, reply){
			var pageDetails = {};
			Mely.Administrator.getStatus({
			}, function(err, statuses){
				var statusList = [];
				for(var status in statuses){
					if (statuses.hasOwnProperty(status)) {
						var row = {};
						row.statusID = statuses[status].id;
						row.statusName = statuses[status].name;
						statusList.push(row);
					}
				}
				Mely.Administrator.getPage({
					systemid: request.auth.credentials.SystemId,
					id: request.params.id
				}, function(err, pages){
					var pageList = [];
					for(var page in pages){
						if (pages.hasOwnProperty(page)){
							var row = {};
							row.pageid = pages[page].id;
							row.title = pages[page].title;
							row.content = pages[page].content;
							row.order = pages[page].ordernum;
							row.onmenu = pages[page].onmenu;
							for(var item in statusList){
								if (statusList[item].statusID === pages[page].StatuId){
									statusList[item].selected = true;
								}
							}
							pageList.push(row);
						}	
					}
					pageDetails.title = "Mely:Edit Page";
					pageDetails.page = pageList[0];
					pageDetails.statusList = statusList;
					pageDetails.type = "Edit";
					reply.view("admin/page/form/index", pageDetails);
				});
			});
		}
	}
},
{
	method: "POST",
	path: "/admin/page/{id}",
	config:{
		handler: function(request, reply){
			Mely.Administrator.updatePage({
				id: request.payload["mely-pageid"],
				title: request.payload["mely-page-title"],
				content: request.payload["mely-page-content"],
				status: request.payload["mely-page-status"],
				order: request.payload["page-order"],
				menuview:request.payload["mely-page-menuview"]
			}, function(err, page){
				if(err){
					throw err;
				}
				if(page !== undefined){
					reply().redirect("/admin/page");
				}
			});
		}
	}
},
{
	method: "GET",
	path: "/admin/post",
	config:{
		handler: function(request, reply){
			Mely.Administrator.getPost({
				systemid: request.auth.credentials.SystemId
			}, function(err, posts){
				var postList = [];
				for(var post in posts){
					if (posts.hasOwnProperty(post)){
						var row = {};
						row.postId = posts[post].id;
						row.title = posts[post].title;
						switch(posts[post].StatuId){
							case 1:
								row.status = "Published";
								break;
							case 2:
								row.status = "Draft";
								break;
							case 3:
								row.status = "Deleted";
								break;
						}
						postList.push(row);
					}
				}
				pageDetails.title = "Mely:Posts";
				pageDetails.postList = postList;
				reply.view("admin/post/index", pageDetails);
			});
		}
	}
},
{
	method: "POST",
	path: "/admin/post",
	config:{
		handler: function(request, reply){
			Mely.Administrator.createPost({
				title:request.payload["mely-post-title"],
				content:request.payload["mely-post-content"],
				systemid:request.auth.credentials.SystemId,
				userid:request.auth.credentials.id,
				status:request.payload["mely-post-status"]
			},function(err,post){
				if(err){
					throw err;
				}
				if(post !== undefined){
					reply().redirect("/admin/post");
				}
			});
		}
	}
},
{
	method: "GET",
	path: "/admin/post/new",
	config:{
		handler: function(request, reply){
			var pageDetails = {};
			Mely.Administrator.getStatus({
			}, function(err, statuses){
				var statusList = [];
				for(var status in statuses){
					if (statuses.hasOwnProperty(status)) {
						var row = {};
						row.statusID = statuses[status].id;
						row.statusName = statuses[status].name;
						statusList.push(row);
					}
				}
				pageDetails.title = "Mely: New Post";
				pageDetails.statusList = statusList;
				pageDetails.type = "New";
				reply.view("admin/post/form/index", pageDetails);
			});
		}
	}
},
{
	method: "GET",
	path: "/admin/post/{id}",
	config:{
		handler: function(request, reply){
			var pageDetails = {};
			Mely.Administrator.getStatus({
			}, function(err, statuses){
				var statusList = [];
				for(var status in statuses){
					if (statuses.hasOwnProperty(status)) {
						var row = {};
						row.statusID = statuses[status].id;
						row.statusName = statuses[status].name;
						statusList.push(row);
					}
				}
				Mely.Administrator.getPost({
					systemid: request.auth.credentials.SystemId,
					id: request.params.id
				}, function(err, posts){
					var postList = [];
					for(var post in posts){
						if (posts.hasOwnProperty(post)) {
							var row = {};
							row.postid = posts[post].id;
							row.title = posts[post].title;
							row.content = posts[post].content;
							for(var item in statusList){
								if (statusList.hasOwnProperty(item)) {
									if (statusList[item].statusID === posts[post].StatuId){
										statusList[item].selected = true;
									}
								}
							}
							postList.push(row);
						}
					}
					pageDetails.title = "Mely: Edit Post";
					pageDetails.post = postList[0];
					pageDetails.statusList = statusList;
					pageDetails.type = "Edit";
					reply.view("admin/post/form/index", pageDetails);
				});
			});
		}
	}
},
{
	method: "POST",
	path: "/admin/post/{id}",
	config:{
		handler: function(request, reply){
			Mely.Administrator.updatePost({
				id: request.payload["mely-postid"],
				title: request.payload["mely-post-title"],
				content: request.payload["mely-post-content"],
				status: request.payload["mely-post-status"]
			}, function(err, post){
				if(err){
					throw err;
				}
				if(post !== undefined){
					reply().redirect("/admin/post");
				}
			});
		}
	}
},
{
	method: "GET",
	path: "/admin/theme",
	config:{
		handler: function(request, reply){
			Mely.Administrator.getTheme({
				systemid: request.auth.credentials.SystemId
			}, function(err, themes){
				var themeList = [];
				for(var theme in themes){
					if (themes.hasOwnProperty(theme)){
						var row = {};
						row.themeid = themes[theme].id;
						row.name = themes[theme].name;
						row.description = themes[theme].description;
						if (themes[theme].active){
							row.status = "Active";
							row.active = true;
						}
						else{
							row.status = "Not Active";
							row.active = false;
						}
						themeList.push(row);
					}
				}
				pageDetails.title = "Mely:Themes";
				pageDetails.themeList = themeList;
				reply.view("admin/theme/index", pageDetails);
			});
		}
	}
},
{
	method: "POST",
	path: "/admin/theme",
	config:{
		handler: function(request, reply){
			Mely.Administrator.createTheme({
				systemid: request.auth.credentials.SystemId,
				name: request.payload.themename,
				description: request.payload.themedescription,
				headback: request.payload.headerbackcolor,
				headfontcolor: request.payload.headerfontcolor,
				headfontsize: request.payload.headerfontsize,
				logo: request.payload.headerimage,
				menuback: request.payload.menubackcolor,
				menufontcolor: request.payload.menufontcolor,
				menufontsize: request.payload.menufontsize,
				posttitlecolor: request.payload.posttitlecolor,
				posttitlesize: request.payload.posttitlefontsize,
				postcontentcolor: request.payload.postcontentcolor,
				postcontentsize: request.payload.postcontentfontsize,
				pagetitlecolor: request.payload.pagetitlecolor,
				pagetitlesize: request.payload.pagetitlefontsize,
				pagecontentcolor: request.payload.pagecontentcolor,
				pagecontentsize: request.payload.pagecontentfontsize
			}, function(err, theme){
				if(err){
					throw err;
				}
				if(theme !== undefined){
					reply().redirect("/admin/theme");
				}
			});
		},
		payload:{
			output: "data",
			parse: true
		},
	}
},
{
	method: "GET",
	path: "/admin/theme/new",
	config:{
		handler: function(request, reply){
			var pageDetails = {};
			pageDetails.title = "Mely:New Theme";
			pageDetails.type = "New";
			reply.view("admin/theme/form/index", pageDetails);
		}
	}
},
{
	method: "GET",
	path: "/admin/theme/{id}",
	config:{
		handler: function(request, reply){
			var pageDetails = {};
			Mely.Administrator.getTheme({
				systemid: request.auth.credentials.SystemId,
				id: request.params.id
			}, function(err, themes){
				var theme = {};
				theme.themeID = themes[0].id;
				theme.name = themes[0].name;
				theme.description = themes[0].description;
				Mely.Administrator.getThemeSetting({
					id: themes[0].id
				}, function(err, themesetting){
					var setting = {};
					setting.headbackcolor = themesetting[0].header_backgroundcolor;
					setting.headfontcolor = themesetting[0].header_fontcolor;
					setting.headfontsize = themesetting[0].header_fontsize;
					if(themesetting[0].header_logo !== null){
						setting.headerimage = themesetting[0].header_logo.toString('base64');
					}
					else{
						setting.headerimage = "";
					}
					setting.menubackcolor = themesetting[0].menu_backgroundcolor;
					setting.menufontcolor = themesetting[0].menu_fontcolor;
					setting.menufontsize = themesetting[0].menu_fontsize;
					setting.posttitlecolor = themesetting[0].post_titlefontcolor;
					setting.posttitlefontsize = themesetting[0].post_titlefontsize;
					setting.postcontentcolor = themesetting[0].post_contentfontcolor;
					setting.postcontentfontsize = themesetting[0].post_contentfontsize;
					setting.pagetitlecolor = themesetting[0].page_titlefontcolor;
					setting.pagetitlefontsize = themesetting[0].page_titlefontsize;
					setting.pagecontentcolor = themesetting[0].page_contentfontcolor;
					setting.pagecontentfontsize = themesetting[0].page_contentfontsize;
					pageDetails.title = "Mely:Themes";
					pageDetails.theme = theme;
					pageDetails.settings = setting;
					pageDetails.type = "Edit";
					reply.view("admin/theme/form/index", pageDetails);
				});
			});
		}
	}
},
{
	method: "POST",
	path: "/admin/theme/{id}",
	config:{
		handler: function(request, reply){
			Mely.Administrator.updateTheme({
				id: request.payload.id,
				name: request.payload.themename,
				description: request.payload.themedescription,
				headback: request.payload.headerbackcolor,
				headfontcolor: request.payload.headerfontcolor,
				headfontsize: request.payload.headerfontsize,
				logo: request.payload.headerimage,
				menuback: request.payload.menubackcolor,
				menufontcolor: request.payload.menufontcolor,
				menufontsize: request.payload.menufontsize,
				posttitlecolor: request.payload.posttitlecolor,
				posttitlesize: request.payload.posttitlefontsize,
				postcontentcolor: request.payload.postcontentcolor,
				postcontentsize: request.payload.postcontentfontsize,
				pagetitlecolor: request.payload.pagetitlecolor,
				pagetitlesize: request.payload.pagetitlefontsize,
				pagecontentcolor: request.payload.pagecontentcolor,
				pagecontentsize: request.payload.pagecontentfontsize
			}, function(err, theme){
				if(err){
					throw err;
				}
				if(theme !== undefined){
					reply().redirect("/admin/theme");
				}
			});
		},
		payload:{
			output: "data",
			parse: true
		},
		auth: true
	}
},
{
	method: "GET",
	path: "/admin/theme/activate/{id}",
	config:{
		handler: function(request, reply){
			Mely.Administrator.activateTheme({
				systemid: request.auth.credentials.SystemId,
				id: request.params.id
			}, function(err, theme){
				if(err){
					throw err;
				}
				if(theme !== undefined){
					reply().redirect("/admin/theme");
				}
			});
		}
	}
},
{
	method: "GET",
	path: "/admin/file",
	config:{
		handler: function(request, reply){
			Mely.Administrator.getThemeFiles({
			}, function(err, files){
				if(err){
					throw err;
				}
				pageDetails.title = "Mely:Theme Files";
				pageDetails.fileList = files;
				reply.view("admin/file/index", pageDetails);
			});
		}
	}
},
{
	method: "GET",
	path: "/admin/file/{id}",
	config:{
		handler: function(request, reply){
			Mely.Administrator.getFileContents({
				id: request.params.id
			}, function(err, file){
				if(err){
					throw err;
				}
				reply(file);
			});
		}
	}
},
{
	method: "POST",
	path: "/admin/markdown",
	config:{
		handler: function(request, reply){
			Mely.Administrator.parseMarkdown({
				content: request.payload.content
			}, function(err, markdown){
				reply(markdown);
			});
		}
	}
},
{
	method: "GET",
	path: "/",
	config:{
		handler: function(request, reply){
			Mely.Administrator.getSystemCount({
			}, function(err, count){
				if(count !== 0){
					Mely.Administrator.getSystem({
					}, function(err, system){
						if(err){
							throw err;
						}
						var systemid = system.id;
						var systemname = system.name;
						var systemtag = system.description;
						async.parallel([
							function(callback){
								Mely.Administrator.getPost({
									systemid: systemid,
									status: 1
								}, function(err, posts){
									if(err){
										throw err;
									}
									var Posts = [];
									for (var post in posts) {
										if (posts.hasOwnProperty(post)){
											var postRecord = {};
											postRecord.postID = posts[post].id;
											postRecord.postTitle = posts[post].title;
											postRecord.postContent = marked(posts[post].content);
											postRecord.postLastDate = moment(posts[post].updatedAt).format('MMMM Do YYYY, h:mm:ss a');
											Posts.push(postRecord);
										}
									}
									var MelyPosts = {
										MelyPosts: Posts
									};
									callback(null, MelyPosts);
								});
							},
							function(callback){
								Mely.Administrator.getPage({
									systemid: systemid,
									status: 1
								}, function(err, pages){
									if(err){
										throw err;
									}
									var Pages = [];
									for (var page in pages) {
										if (pages.hasOwnProperty(page)){
											var pageRecord = {};
											pageRecord.pageID = pages[page].id;
											pageRecord.pageTitle = pages[page].title;
											pageRecord.pageLinkText = changeCase.lowerCase(pages[page].title.replace(" ","_"));
											pageRecord.onmenu = pages[page].onmenu;
											Pages.push(pageRecord);
										}
									}
									var MelyPages = {
										MelyPages: Pages
									};
									callback(null, MelyPages);
								});
							},
							function(callback){
								Mely.Administrator.getTheme({
									systemid: systemid,
									active: true
								}, function(err, theme){
									if(err){
										throw err;
									}
									if (theme.length !== 0){
										Mely.Administrator.getThemeSetting({
											id: theme[0].id
										}, function(err, themesetting){
											var themeRecord = {};
											themeRecord.themeLogo = themesetting[0].header_logo.toString('base64');
											themeRecord.themeHeaderBackground = themesetting[0].header_backgroundcolor;
											themeRecord.themeHeaderFontColor = themesetting[0].header_fontcolor;
											themeRecord.themeHeaderFontSize = themesetting[0].header_fontsize;
											themeRecord.themeMenuBackground = themesetting[0].menu_backgroundcolor;
											themeRecord.themeMenuFontColor = themesetting[0].menu_fontcolor;
											themeRecord.themeMenuFontSize = themesetting[0].menu_fontsize;
											themeRecord.themePostTitleFontColor = themesetting[0].post_titlefontcolor;
											themeRecord.themePostTitleFontSize = themesetting[0].post_titlefontsize;
											themeRecord.themePostContentFontColor = themesetting[0].post_contentfontcolor;
											themeRecord.themePostContentFontSize = themesetting[0].post_contentfontsize;
											themeRecord.themePageTitleFontColor = themesetting[0].page_titlefontcolor;
											themeRecord.themePageTitleFontSize = themesetting[0].page_titlefontsize;
											themeRecord.themePageContentFontColor = themesetting[0].page_contentfontcolor;
											themeRecord.themePageContentFontSize = themesetting[0].page_contentfontsize;
											var MelyTheme = {
												MelyTheme: themeRecord
											};
											callback(null, MelyTheme);
										});
									}
									else{
										var MelyTheme = {
											MelyTheme: null
										};
										callback(null, MelyTheme);
									}
								});
							}
						], function(err, results){
							pageDetails.title = "Mely";
							pageDetails.system = {
								title: systemname,
								tag: systemtag
							};
							results.filter(function(results){
								if (results.hasOwnProperty("MelyPosts")) {
									pageDetails.MelyPosts = results.MelyPosts;
								}
							});
							results.filter(function(results){
								if (results.hasOwnProperty("MelyPages")) {
									pageDetails.MelyPages = results.MelyPages;
								}
							});
							results.filter(function(results){
								if (results.hasOwnProperty("MelyTheme")) {
									pageDetails.MelyTheme = results.MelyTheme;
								}
							});
							reply.view("mely/index", pageDetails);
						});
					});
				}
				else{
					reply().redirect("/welcome");
				}
			});
		},
		auth: false
	}
},
{
	method: "GET",
	path: "/{pagename}",
	config:{
		handler: function(request, reply){
			Mely.Administrator.getSystem({
			}, function(err, system){
				if(err){
					throw err;
				}
				var systemid = system.id;
				var systemname = system.name;
				var systemtag = system.description;
				async.parallel([
					function(callback){
						Mely.Administrator.getPost({
							systemid: systemid,
							status: 1
						}, function(err, posts){
							if(err){
								throw err;
							}
							var Posts = [];
							for (var post in posts) {
								if (posts.hasOwnProperty(post)){
									var postRecord = {};
									postRecord.postID = posts[post].id;
									postRecord.postTitle = posts[post].title;
									postRecord.postContent = marked(posts[post].content);
									postRecord.postLastDate = moment(posts[post].updatedAt).format('MMMM Do YYYY, h:mm:ss a');
									Posts.push(postRecord);
								}
							}
							var MelyPosts = {
								MelyPosts: Posts
							};
							callback(null, MelyPosts);
						});
					},
					function(callback){
						//menu pages
						Mely.Administrator.getPage({
							systemid: systemid,
							status: 1
						}, function(err, pages){
							if(err){
								throw err;
							}
							var Pages = [];
							for (var page in pages) {
								if (pages.hasOwnProperty(page)){
									var pageRecord = {};
									pageRecord.pageID = pages[page].id;
									pageRecord.pageTitle = pages[page].title;
									pageRecord.pageLinkText = changeCase.lowerCase(pages[page].title.replace(" ","_"));
									Pages.push(pageRecord);
								}
							}
							var MelyPages = {
								MelyPages: Pages
							};
							callback(null, MelyPages);
						});
					},
					function(callback){
						//page content
						Mely.Administrator.getPage({
							systemid: systemid,
							status: 1,
							title: request.params.pagename.replace("_"," ")
						}, function(err, page){
							if(err){
								throw err;
							}
							var Page = [];
							for (var item in page) {
								if (page.hasOwnProperty(item)){
									var pageRecord = {};
									pageRecord.pageTitle = page[item].title;
									pageRecord.pageContent = marked(page[item].content);
									Page.push(pageRecord);
								}
							}
							var MelyPage = {
								MelyPage: Page
							};
							callback(null, MelyPage);
						});
					},
					function(callback){
						Mely.Administrator.getTheme({
							systemid: systemid,
							active: true
						}, function(err, theme){
							if(err){
								throw err;
							}
							if (theme.length !== 0){
								Mely.Administrator.getThemeSetting({
									id: theme[0].id
								}, function(err, themesetting){
									var themeRecord = {};
									themeRecord.themeLogo = themesetting[0].header_logo.toString('base64');
									themeRecord.themeHeaderBackground = themesetting[0].header_backgroundcolor;
									themeRecord.themeHeaderFontColor = themesetting[0].header_fontcolor;
									themeRecord.themeHeaderFontSize = themesetting[0].header_fontsize;
									themeRecord.themeMenuBackground = themesetting[0].menu_backgroundcolor;
									themeRecord.themeMenuFontColor = themesetting[0].menu_fontcolor;
									themeRecord.themeMenuFontSize = themesetting[0].menu_fontsize;
									themeRecord.themePostTitleFontColor = themesetting[0].post_titlefontcolor;
									themeRecord.themePostTitleFontSize = themesetting[0].post_titlefontsize;
									themeRecord.themePostContentFontColor = themesetting[0].post_contentfontcolor;
									themeRecord.themePostContentFontSize = themesetting[0].post_contentfontsize;
									themeRecord.themePageTitleFontColor = themesetting[0].page_titlefontcolor;
									themeRecord.themePageTitleFontSize = themesetting[0].page_titlefontsize;
									themeRecord.themePageContentFontColor = themesetting[0].page_contentfontcolor;
									themeRecord.themePageContentFontSize = themesetting[0].page_contentfontsize;
									var MelyTheme = {
										MelyTheme: themeRecord
									};
									callback(null, MelyTheme);
								});
							}
							else{
								var MelyTheme = {
									MelyTheme: null
								};
								callback(null, MelyTheme);
							}
						});
					}
				], function(err, results){
					pageDetails.title = "Mely";
					pageDetails.system = {
						title: systemname,
						tag: systemtag
					};
					results.filter(function(results){
						if (results.hasOwnProperty("MelyPosts")) {
							pageDetails.MelyPosts = results.MelyPosts;
						}
					});
					results.filter(function(results){
						if (results.hasOwnProperty("MelyPages")) {
							pageDetails.MelyPages = results.MelyPages;
						}
					});
					results.filter(function(results){
						if (results.hasOwnProperty("MelyTheme")) {
							pageDetails.MelyTheme = results.MelyTheme;
						}
					});
					results.filter(function(results){
						if (results.hasOwnProperty("MelyPage")) {
							pageDetails.MelyPage = results.MelyPage;
						}
					});
					reply.view("mely/page", pageDetails);
				});
			});
		},
		auth: false
	}
},
{
	method: "GET",
	path: "/post/{id}",
	config:{
		handler: function(request, reply){
			Mely.Administrator.getSystem({
			}, function(err, system){
				if(err){
					throw err;
				}
				var systemid = system.id;
				var systemname = system.name;
				var systemtag = system.description;
				async.parallel([
					function(callback){
						Mely.Administrator.getPost({
							systemid: systemid,
							status: 1,
							id: request.params.id
						}, function(err, posts){
							if(err){
								throw err;
							}
							var Posts = [];
							for (var post in posts) {
								if (posts.hasOwnProperty(post)){
									var postRecord = {};
									postRecord.postID = posts[post].id;
									postRecord.postTitle = posts[post].title;
									postRecord.postContent = marked(posts[post].content);
									postRecord.postLastDate = moment(posts[post].updatedAt).format('MMMM Do YYYY, h:mm:ss a');
									Posts.push(postRecord);
								}
							}
							var MelyPosts = {
								MelyPosts: Posts
							};
							callback(null, MelyPosts);
						});
					},
					function(callback){
						//menu pages
						Mely.Administrator.getPage({
							systemid: systemid,
							status: 1
						}, function(err, pages){
							if(err){
								throw err;
							}
							var Pages = [];
							for (var page in pages) {
								if (pages.hasOwnProperty(page)){
									var pageRecord = {};
									pageRecord.pageID = pages[page].id;
									pageRecord.pageTitle = pages[page].title;
									pageRecord.pageLinkText = changeCase.lowerCase(pages[page].title.replace(" ","_"));
									Pages.push(pageRecord);
								}
							}
							var MelyPages = {
								MelyPages: Pages
							};
							callback(null, MelyPages);
						});
					},
					function(callback){
						Mely.Administrator.getTheme({
							systemid: systemid,
							active: true
						}, function(err, theme){
							if(err){
								throw err;
							}
							if (theme.length !== 0){
								Mely.Administrator.getThemeSetting({
									id: theme[0].id
								}, function(err, themesetting){
									var themeRecord = {};
									themeRecord.themeLogo = themesetting[0].header_logo.toString('base64');
									themeRecord.themeHeaderBackground = themesetting[0].header_backgroundcolor;
									themeRecord.themeHeaderFontColor = themesetting[0].header_fontcolor;
									themeRecord.themeHeaderFontSize = themesetting[0].header_fontsize;
									themeRecord.themeMenuBackground = themesetting[0].menu_backgroundcolor;
									themeRecord.themeMenuFontColor = themesetting[0].menu_fontcolor;
									themeRecord.themeMenuFontSize = themesetting[0].menu_fontsize;
									themeRecord.themePostTitleFontColor = themesetting[0].post_titlefontcolor;
									themeRecord.themePostTitleFontSize = themesetting[0].post_titlefontsize;
									themeRecord.themePostContentFontColor = themesetting[0].post_contentfontcolor;
									themeRecord.themePostContentFontSize = themesetting[0].post_contentfontsize;
									themeRecord.themePageTitleFontColor = themesetting[0].page_titlefontcolor;
									themeRecord.themePageTitleFontSize = themesetting[0].page_titlefontsize;
									themeRecord.themePageContentFontColor = themesetting[0].page_contentfontcolor;
									themeRecord.themePageContentFontSize = themesetting[0].page_contentfontsize;
									var MelyTheme = {
										MelyTheme: themeRecord
									};
									callback(null, MelyTheme);
								});
							}
							else{
								var MelyTheme = {
									MelyTheme: null
								};
								callback(null, MelyTheme);
							}
						});
					}
				], function(err, results){
					pageDetails.title = "Mely";
					pageDetails.system = {
						title: systemname,
						tag: systemtag
					};
					results.filter(function(results){
						if (results.hasOwnProperty("MelyPosts")) {
							pageDetails.MelyPosts = results.MelyPosts;
						}
					});
					results.filter(function(results){
						if (results.hasOwnProperty("MelyPages")) {
							pageDetails.MelyPages = results.MelyPages;
						}
					});
					results.filter(function(results){
						if (results.hasOwnProperty("MelyTheme")) {
							pageDetails.MelyTheme = results.MelyTheme;
						}
					});
					reply.view("mely/post", pageDetails);
				});
			});
		},
		auth: false
	}
},
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
},
{
	method: "GET",
	path: "/favicon.ico",
	handler:{
		file: "favicon.ico"
	},
	config:{
		cache:{
			expiresIn: 86400000
		}
	}
},
{
	method: "GET",
	path: "/preview/{type}/{id}",
	config:{
		handler: function(request, reply){
			switch(request.params.type){
				case "post":
					Mely.Administrator.getPost({
						systemid: request.auth.credentials.SystemId,
						id: request.params.id
					}, function(err, posts){
						for(var post in posts){
							if (posts.hasOwnProperty(post)) {
								pageDetails.preview_title = posts[post].title;
								pageDetails.preview_content = marked(posts[post].content);
							}
						}
						reply.view("admin/preview/index", pageDetails);
					});
					break;
				case "page":
					Mely.Administrator.getPage({
						systemid: request.auth.credentials.SystemId,
						id: request.params.id
					}, function(err, pages){
						for(var page in pages){
							if (pages.hasOwnProperty(page)) {
								pageDetails.preview_title = pages[page].title;
								pageDetails.preview_content = marked(pages[page].content);
							}
						}
						reply.view("admin/preview/index", pageDetails);
					});
					break;
			}
		}
	}
},
];
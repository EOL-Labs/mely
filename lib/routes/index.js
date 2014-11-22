var crypto = require('crypto');
var moment = require('moment');
var async = require('async');
var marked = require('marked');
var changeCase = require('change-case');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var chance = require("chance").Chance();
var Mely = {};
var administration = require("../administration");
var mail = require('../../config/mail');
var mailTransport = nodemailer.createTransport(smtpTransport(mail.mailconfig));
var email = require("../email").templates.email_template();
Mely.Administrator = administration;

exports.routes = [
//first step routes
{
	method: "GET",
	path: "/welcome",
	config:{
		handler: function(request, reply){
			var pageDetails = {};
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
							name: "Mely v0.2.0",
							description: "Default Theme for Mely",
							headback: "FFFFFF",
							headfontcolor: "000000",
							headfontsize: 26,
							menuback: "FFFFFF",
							menufontcolor: "000000",
							menufontsize: 15,
							posttitlecolor: "000000",
							posttitlesize: 13,
							postcontentcolor: "000000",
							postcontentsize: 11,
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
									var html = email.replace("##EmailType","Welcome");
									html = html.replace("##EmailGreeting","Welcome to Mely!");
									html = html.replace("##EmailContent","So you've decided to us Mely for you blog or website. That is awesome and we love that you are using this great new product!");
									var message = {
										from: mail.mailconfig.from,
										to: request.payload["mely-email"],
										subject: "Welcome to Mely!",
										html: html
									}
									mailTransport.sendMail(message, function(error){
										if(error) throw error;
										console.log('Message sent successfully!');
										reply().redirect("/login");
									});
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
//login & password reset routes
{
	method: "GET",
	path: "/login",
	config:{
		handler: function(request, reply){
			var pageDetails = {};
			if (request.auth.credentials === undefined){
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
	path: "/reset",
	config:{
		handler: function(request, reply){
			var pageDetails = {};
			pageDetails.title = "Mely: Reset Password";
			reply.view("reset/index", pageDetails);
		},
		auth:{
			mode: "try"
		}
	}
},
{
	method: "POST",
	path: "/reset",
	config:{
		handler: function(request, reply){
			var password = chance.word({length: 10});
			var passwordHashed = crypto.createHash('sha256').update(password).digest("hex");
			Mely.Administrator.resetPassword({
				email: request.payload["mely-email"],
				password: passwordHashed,
			}, function(err, user){
				if(err === "No Email"){
					reply().redirect("/reset?error");
				}
				else{
					var html = email.replace("##EmailType","Password Reset");
					html = html.replace("##EmailGreeting","About that password...");
					html = html.replace("##EmailContent","Your password has been reset: " + password);
					var message = {
						from: mail.mailconfig.from,
						to: request.payload["mely-email"],
						subject: "Password Reset",
						html: html
					}
					mailTransport.sendMail(message, function(error){
						if(error) throw error;
						console.log('Message sent successfully!');
						reply().redirect("/reset?success");
					});
				}
			});
		},
		auth:{
			mode: "try"
		}
	}
},
//admin route
{
	method: "GET",
	path: "/admin",
	config:{
		handler: function(request, reply){
			var pageDetails = {};
			pageDetails.title = "Mely:Admin";
			reply.view("admin/index", pageDetails);
		}
	}
},
//user routes
{
	method: "GET",
	path: "/admin/user",
	config:{
		handler: function(request, reply){
			Mely.Administrator.getUser({
				systemid: request.auth.credentials.SystemId
			}, function(err, users){
				if(err) reply(err);
				var userList = [];
				for(var user in users){
					if (users.hasOwnProperty(user)) {
						var row = {};
						row.userid = users[user].id;
						row.email = users[user].email_address;
						row.createdDate = moment(users[user].createdAt).format("MMMM Do YYYY, h:mm:ss a");
						row.updatedDate = moment(users[user].updatedAt).format("MMMM Do YYYY, h:mm:ss a");
						row.status = users[user].status;
						userList.push(row);
					}
				}
				reply(userList);
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
				if(err) reply(err);
				if(user !== undefined){
					var html = email.replace("##EmailType","Administration");
					html = html.replace("##EmailGreeting","Someone though you were awesome");
					html = html.replace("##EmailContent","You can login with your email and password that was given to you.");
					var message = {
						from: mail.mailconfig.from,
						to: request.payload["mely-email"],
						subject: "You have been added to a Mely System!",
						html: html
					}
					mailTransport.sendMail(message, function(error){
						if(error) throw error;
						console.log('Message sent successfully!');
						reply("New User Added");
					});
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
				if(err) reply(err);
				reply("deleted");
			});
		}
	}
},
//page routes
{
	method: "GET",
	path: "/admin/page",
	config:{
		handler: function(request, reply){
			var pageDetails = {};
			Mely.Administrator.getPage({
				systemid: request.auth.credentials.SystemId
			}, function(err, pages){
				if(err) reply(err);
				var pageList = [];
				for(var page in pages){
					if (pages.hasOwnProperty(page)) {
						var row = {};
						row.pageId = pages[page].id;
						row.title = pages[page].title;
						row.order = pages[page].ordernum;
						row.onmenu = pages[page].onmenu === true ? 1 : 0;
						row.status = pages[page].status
						pageList.push(row);
					}
				}
				reply(pageList);
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
			Mely.Administrator.getPage({
				systemid: request.auth.credentials.SystemId,
				id: request.params.id
			}, function(err, pages){
				if(err) reply(err);
				var pageList = [];
				for(var page in pages){
					if (pages.hasOwnProperty(page)){
						var row = {};
						row.pageid = pages[page].id;
						row.title = pages[page].title;
						row.content = pages[page].content;
						row.order = pages[page].ordernum;
						row.onmenu = pages[page].onmenu === true ? 1 : 0;
						row.status = pages[page].status;
						pageList.push(row);
					}	
				}
				reply(pageList[0]);
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
				menuview:request.payload["mely-page-menuview"] === '0' ? false:true
			},function(err,page){
				if(err) reply(err);
				reply("Page Added");
			});
		}
	}
},
{
	method: "PUT",
	path: "/admin/page",
	config:{
		handler: function(request, reply){
			Mely.Administrator.updatePage({
				id: request.payload["mely-pageid"],
				title: request.payload["mely-page-title"],
				content: request.payload["mely-page-content"],
				status: request.payload["mely-page-status"],
				order: request.payload["page-order"],
				menuview: request.payload["mely-page-menuview"] === '0' ? false:true
			}, function(err, page){
				if(err) reply(err);
				reply("Page Edited");
			});
		}
	}
},
{
	method: "DELETE",
	path: "/admin/page/{id}",
	config:{
		handler: function(request, reply){
			Mely.Administrator.deletePage({
				id: request.params.id
			}, function(err, user){
				if(err) reply(err);
				reply("Page Deleted");
			});
		}
	}
},
//post routes
{
	method: "GET",
	path: "/admin/post",
	config:{
		handler: function(request, reply){
			Mely.Administrator.getPost({
				systemid: request.auth.credentials.SystemId
			}, function(err, posts){
				if(err) reply(err);
				var postList = [];
				for(var post in posts){
					if (posts.hasOwnProperty(post)){
						var row = {};
						row.postId = posts[post].id;
						row.title = posts[post].title;
						row.comments_allowed = posts[post].comments_allowed === true ? 1 : 0;
						row.status = posts[post].status;
						postList.push(row);
					}
				}
				reply(postList);
			});
		}
	}
},
{
	method: "GET",
	path: "/admin/post/{id}",
	config:{
		handler: function(request, reply){
			Mely.Administrator.getPost({
				systemid: request.auth.credentials.SystemId,
				id: request.params.id
			}, function(err, posts){
				if(err) reply(err);
				var postList = [];
				for(var post in posts){
					if (posts.hasOwnProperty(post)) {
						var row = {};
						row.postid = posts[post].id;
						row.title = posts[post].title;
						row.content = posts[post].content;
						row.comments_allowed = posts[post].comments_allowed === true ? 1 : 0;
						row.status = posts[post].status;
						postList.push(row);
					}
				}
				reply(postList[0]);
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
				status:request.payload["mely-post-status"],
				comments:request.payload["mely-post-comments"] === '0' ? false:true
			},function(err,post){
				if(err) reply(err);
				reply("Post Added");
			});
		}
	}
},
{
	method: "PUT",
	path: "/admin/post",
	config:{
		handler: function(request, reply){
			Mely.Administrator.updatePost({
				id: request.payload["mely-postid"],
				title: request.payload["mely-post-title"],
				content: request.payload["mely-post-content"],
				status: request.payload["mely-post-status"],
				comments: request.payload["mely-post-comments"] === '0' ? false:true
			}, function(err, post){
				if(err) reply(err);
				reply("Post Edited");
			});
		}
	}
},
{
	method: "DELETE",
	path: "/admin/post/{id}",
	config:{
		handler: function(request, reply){
			Mely.Administrator.deletePost({
				id: request.params.id
			}, function(err, user){
				if(err) reply(err);
				reply("Post Deleted");
			});
		}
	}
},
{
	method: "GET",
	path: "/admin/comment",
	config:{
		handler: function(request, reply){
			var pageDetails = {};
			pageDetails.title = "Mely: Comments";
			Mely.Administrator.getComment({
				systemid:request.auth.credentials.SystemId
			}, function(err, comments){
				if(err) reply(err);
				var Comments = [];
				for (var comment in comments) {
					if (comments.hasOwnProperty(comment)){
						var row = {};
						row.commentid = comments[comment].id;
						row.postid = comments[comment].PostId;
						row.approved = comments[comment].approved;
						row.commentemail = comments[comment].email;
						row.commentcontent = comments[comment].content;
						row.commentcreatedate = moment(comments[comment].createdAt).format('MMMM Do YYYY h:mm a');
						row.commentmodifydate = moment(comments[comment].updatedAt).format('MMMM Do YYYY h:mm a');
						Comments.push(row);
					}
				}
				reply(Comments);
			});			
		}
	}
},
{
	method: "GET",
	path: "/admin/post/comment/{postid}",
	config:{
		handler: function(request, reply){
			var pageDetails = {};
			pageDetails.title = "Mely: Comments";
			Mely.Administrator.getComment({
				systemid:request.auth.credentials.SystemId,
				postid:request.params["postid"]
			}, function(err, comments){
				if(err) reply(err);
				var Comments = [];
				for (var comment in comments) {
					if (comments.hasOwnProperty(comment)){
						var row = {};
						row.commentid = comments[comment].id;
						row.postid = comments[comment].PostId;
						row.approved = comments[comment].approved;
						row.commentemail = comments[comment].email;
						row.commentcontent = comments[comment].content;
						row.commentcreatedate = moment(comments[comment].createdAt).format('MMMM Do YYYY h:mm a');
						row.commentmodifydate = moment(comments[comment].updatedAt).format('MMMM Do YYYY h:mm a');
						Comments.push(row);
					}
				}
				pageDetails.comments = Comments;
				reply.view("admin/post/comment/index", pageDetails);
			});			
		}
	}
},
{
	method: "GET",
	path: "/admin/post/comment/{id}/{direction}",
	config:{
		handler: function(request, reply){
			Mely.Administrator.approveComment({
				commentid:request.params["id"],
				direction:request.params["direction"]
			}, function(err, comments){
				if(err) reply(err);
				reply("comment status changed");
			});			
		}
	}
},
//theme routes
{
	method: "GET",
	path: "/admin/theme",
	config:{
		handler: function(request, reply){
			var pageDetails = {};
			Mely.Administrator.getTheme({
				systemid: request.auth.credentials.SystemId
			}, function(err, themes){
				if(err) reply(err);
				var themeList = [];
				for(var theme in themes){
					if (themes.hasOwnProperty(theme)){
						var row = {};
						row.themeid = themes[theme].id;
						row.name = themes[theme].name;
						row.description = themes[theme].description;
						row.status = themes[theme].active;
						themeList.push(row);
					}
				}
				reply(themeList);
			});
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
				if(err) reply(err);
				var theme = {};
				theme.themeID = themes[0].id;
				theme.name = themes[0].name;
				theme.description = themes[0].description;
				Mely.Administrator.getThemeSetting({
					id: themes[0].id
				}, function(err, themesetting){
					if(err) reply(err);
					theme.headbackcolor = themesetting[0].header_backgroundcolor;
					theme.headfontcolor = themesetting[0].header_fontcolor;
					theme.headfontsize = themesetting[0].header_fontsize;
					theme.headerimage = themesetting[0].headerfilename;
					theme.menubackcolor = themesetting[0].menu_backgroundcolor;
					theme.menufontcolor = themesetting[0].menu_fontcolor;
					theme.menufontsize = themesetting[0].menu_fontsize;
					theme.posttitlecolor = themesetting[0].post_titlefontcolor;
					theme.posttitlefontsize = themesetting[0].post_titlefontsize;
					theme.postcontentcolor = themesetting[0].post_contentfontcolor;
					theme.postcontentfontsize = themesetting[0].post_contentfontsize;
					theme.pagetitlecolor = themesetting[0].page_titlefontcolor;
					theme.pagetitlefontsize = themesetting[0].page_titlefontsize;
					theme.pagecontentcolor = themesetting[0].page_contentfontcolor;
					theme.pagecontentfontsize = themesetting[0].page_contentfontsize;
					reply(theme);
				});
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
				logo: ((request.payload.headerimage !== undefined) ? request.payload.headerimage.hapi.filename : null),
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
				if(err) reply(err);
				if(theme !== undefined){
					if(request.payload.headerimage !== undefined){
						var fs = require('fs');
						fs.writeFileSync("./static/img/" + request.payload.headerimage.hapi.filename, request.payload.headerimage._data);
					}
					reply("Theme Added")
				}
			});
		},
		payload:{
			output: "stream",
			parse: true
		},
	}
},
{
	method: "PUT",
	path: "/admin/theme",
	config:{
		handler: function(request, reply){
			Mely.Administrator.updateTheme({
				id: request.payload.id,
				name: request.payload.themename,
				description: request.payload.themedescription,
				headback: request.payload.headerbackcolor,
				headfontcolor: request.payload.headerfontcolor,
				headfontsize: request.payload.headerfontsize,
				logo: ((request.payload.headerimage !== undefined) ? request.payload.headerimage.hapi.filename : null),
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
				if(err) reply(err);
				if(theme !== undefined){
					if(request.payload.headerimage !== undefined){
						var fs = require('fs');
						fs.writeFileSync("./static/img/" + request.payload.headerimage.hapi.filename, request.payload.headerimage._data);
					}
					reply("Theme Updated");
				}
			});
		},
		payload:{
			output: "stream",
			parse: true
		},
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
				if(err) reply(err);
				reply("Theme activated")
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
				if(err) reply(err);
				reply(files);
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
				if(err) reply(err);
				reply(file);
			});
		}
	}
},
{
	method: "POST",
	path: "/admin/file/save",
	config:{
		handler: function(request, reply){
			Mely.Administrator.writeFileContents({
				filename: request.payload.filename,
				content: request.payload.content
			}, function(err, result){
				if(err) reply(err);
				reply(result);
			});
		}
	}
},
//blog routes
{
	method: "GET",
	path: "/",
	config:{
		handler: function(request, reply){
			var pageDetails = {};
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
											postRecord.postLastDate = moment(posts[post].updatedAt).format('MMMM Do YYYY h:mm a');
											postRecord.comments_allowed = posts[post].comments_allowed;
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
											themeRecord.themeLogo = themesetting[0].headerfilename;
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
			var pageDetails = {};
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
									postRecord.postLastDate = moment(posts[post].updatedAt).format('MMMM Do YYYY h:mm a');
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
									themeRecord.themeLogo = themesetting[0].headerfilename;
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
			var pageDetails = {};
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
									postRecord.postLastDate = moment(posts[post].updatedAt).format('MMMM Do YYYY h:mm a');
									postRecord.comments_allowed = posts[post].comments_allowed;
									Mely.Administrator.getComment({
										systemid: systemid,
										postid: request.params.id,
										approved: true
									}, function(err, comments){
										if(err){
											throw err;
										}
										var Comments = [];
										for (var comment in comments) {
											if (comments.hasOwnProperty(comment)){
												var commentRecord = {};
												commentRecord.id = comments[comment].id;
												commentRecord.email = comments[comment].email;
												commentRecord.content = comments[comment].content;
												commentRecord.date = moment(comments[comment].createdAt).format('MMMM Do YYYY h:mm a');
												commentRecord.upvote = comments[comment].upvote;
												commentRecord.downvote = comments[comment].downvote;
												Comments.push(commentRecord);
											}
										}
										postRecord.comments = Comments;
										Posts.push(postRecord);
										var MelyPosts = {
											MelyPosts: Posts
										};
										callback(null, MelyPosts);
									});	
								}
							}
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
									themeRecord.themeLogo = themesetting[0].headerfilename;
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
					pageDetails.SinglePost = true;
					reply.view("mely/post", pageDetails);
				});
			});
		},
		auth: false
	}
},
{
	method: "POST",
	path: "/comment",
	config:{
		handler: function(request, reply){
			Mely.Administrator.getSystem({
			}, function(err, system){
				if(err){
					throw err;
				}
				Mely.Administrator.createComment({
					systemid: system.id,
					email: request.payload["email"],
					content: request.payload["content"],
					postid: request.payload["postid"]
				}, function(err, comment){
					if(err){
						throw err;
					}
					if(comment !== undefined){
						reply().redirect("/post/" + request.payload["postid"] + "#comment-sent");
					}
				});
			});
		},
		auth: false
	}
},
{
	method: "GET",
	path: "/comment/{id}/up",
	config:{
		handler: function(request, reply){
			Mely.Administrator.upComment({
				commentid:request.params["id"]
			}, function(err, comment){
				if(err){
					throw err;
				}
				reply().redirect("/post/" + comment.PostId);
			});
		},
		auth: false
	}
},
{
	method: "GET",
	path: "/comment/{id}/down",
	config:{
		handler: function(request, reply){
			Mely.Administrator.downComment({
				commentid:request.params["id"]
			}, function(err, comment){
				if(err){
					throw err;
				}
				reply().redirect("/post/" + comment.PostId);
			});
		},
		auth: false
	}
},
//misc routes
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
}
];
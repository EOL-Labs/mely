var crypto = require("crypto");
var moment = require("moment");
var marked = require("marked");
var joi = require("joi");
var changeCase = require("change-case");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var chance = require("chance").Chance();
var mail = require("../../config/mail");
var mailTransport = nodemailer.createTransport(smtpTransport(mail.mailconfig));
var email = require("../email").templates.email_template();
var Mely = require("../../lib");

exports.routes = [
//first step routes
{
	method: "GET",
	path: "/welcome",
	config:{
		handler: function(request, reply){
			var pageDetails = {};
			Mely.System.getSystemCount({
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
			Mely.System.createSystem({
				name: request.payload["mely-name"],
				description: request.payload["mely-description"] ? request.payload["mely-description"] : null
			}, function(err, system){
				if(err) reply(err);
				Mely.User.createUser({
					email: request.payload["mely-email"],
					password: crypto.createHash('sha256').update(request.payload["mely-password"]).digest("hex"),
					systemid: system.id
				}, function(err, user){
					if(err) reply(err);
					if(user !== undefined){
						Mely.Theme.createTheme({
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
							if(err) reply(err);
							Mely.Theme.activateTheme({
								systemid: system.id,
								id: theme.ThemeId
							}, function(err, theme){
								if(err) reply(err);
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
										if(err) reply(err);
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
		validate:{
			payload:{
				"mely-name": joi.string().required(),
				"mely-password": joi.string().required(),
				"mely-email": joi.string().email().required(),
				"mely-description": joi.string(),

			}
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
			Mely.System.getSystemCount({
			}, function(err, count){
			if(count > 0){
				if (request.auth.isAuthenticated){
					reply().redirect("/admin");
				}
				else{
					pageDetails.title = "Mely:Login";
					reply.view("login/index", pageDetails);
				}
			}
			else{
				reply().redirect("/welcome");
			}
			});
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
			Mely.User.loginUser({
				email: request.payload["mely-email"],
				password: crypto.createHash('sha256').update(request.payload["mely-password"]).digest("hex")
			}, function(err, user){
				if(err) reply(err);
				if(user !== null){
					request.auth.session.set(user.dataValues);
					reply().redirect("/admin");
				}
				else{
					reply().redirect("/login?invalid");
				}
			});
		},
		validate:{
			payload:{
				"mely-email": joi.string().email().required(),
				"mely-password": joi.string().required()
			}
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
			console.log(password);
			var passwordHashed = crypto.createHash('sha256').update(password).digest("hex");
			Mely.User.resetPassword({
				email: request.payload["mely-email"],
				password: passwordHashed,
			}, function(err, user){
				if(err === "No Email"){
					reply().redirect("/reset?success");
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
						if(err) reply(err);
						console.log('Message sent successfully!');
						reply().redirect("/reset?success");
					});
				}
			});
		},
		auth:{
			mode: "try"
		},
		validate:{
			payload:{
				"mely-email": joi.string().email().required()
			}
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
			Mely.User.getUser({
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
		},
	}
},
{
	method: "POST",
	path: "/admin/user",
	config:{
		handler: function(request, reply){
			Mely.User.createUser({
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
						if(err) reply(err);
						console.log('Message sent successfully!');
						reply("New User Added");
					});
				}
			});
		},
		validate:{
			payload:{
				"mely-email": joi.string().email().required(),
				"mely-password": joi.string().required()
			}
		}
	}
},
{
	method: "DELETE",
	path: "/admin/user/{id}",
	config:{
		handler: function(request, reply){
			Mely.User.deleteUser({
				id: request.params.id
			}, function(err, user){
				if(err) reply(err);
				reply("deleted");
			});
		},
		validate:{
			params:{
				id: joi.number().required()
			}
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
			Mely.Page.getPage({
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
			Mely.Page.getPage({
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
		},
		validate:{
			params:{
				id: joi.number().required()
			}
		}
	}
},
{
	method: "POST",
	path: "/admin/page",
	config:{
		handler: function(request, reply){
			Mely.Page.createPage({
				title:request.payload["mely-page-title"],
				content:request.payload["mely-page-content"],
				systemid:request.auth.credentials.SystemId,
				userid:request.auth.credentials.id,
				status:request.payload["mely-page-status"],
				order:request.payload["page-order"],
				menuview:request.payload["mely-page-menuview"]
			},function(err,page){
				if(err) reply(err);
				reply("Page Added");
			});
		},
		validate:{
			payload:{
				"mely-page-title": joi.string().required(),
				"mely-page-content": joi.string().required(),
				"mely-page-status": joi.number().required(),
				"page-order": joi.number().required(),
				"mely-page-menuview": joi.number().required(),
			}
		}
	}
},
{
	method: "PUT",
	path: "/admin/page",
	config:{
		handler: function(request, reply){
			Mely.Page.updatePage({
				id: request.payload["mely-pageid"],
				title: request.payload["mely-page-title"],
				content: request.payload["mely-page-content"],
				status: request.payload["mely-page-status"],
				order: request.payload["page-order"],
				menuview: request.payload["mely-page-menuview"]
			}, function(err, page){
				if(err) reply(err);
				reply("Page Edited");
			});
		},
		validate:{
			payload:{
				"mely-pageid": joi.number().required(),
				"mely-page-title": joi.string().required(),
				"mely-page-content": joi.string().required(),
				"mely-page-status": joi.number().required(),
				"page-order": joi.number().required(),
				"mely-page-menuview": joi.number().required(),
			}
		}
	}
},
{
	method: "DELETE",
	path: "/admin/page/{id}",
	config:{
		handler: function(request, reply){
			Mely.Page.deletePage({
				id: request.params.id
			}, function(err, user){
				if(err) reply(err);
				reply("Page Deleted");
			});
		},
		validate:{
			params:{
				id: joi.number().required()
			}
		}
	}
},
//post routes
{
	method: "GET",
	path: "/admin/post",
	config:{
		handler: function(request, reply){
			Mely.Post.getPost({
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
						row.createdDate = moment(posts[post].createdAt).format("MMMM Do YYYY h:mm a");
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
			Mely.Post.getPost({
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
		},
		validate:{
			params:{
				id: joi.number().required()
			}
		}
	}
},
{
	method: "POST",
	path: "/admin/post",
	config:{
		handler: function(request, reply){
			Mely.Post.createPost({
				title:request.payload["mely-post-title"],
				content:request.payload["mely-post-content"],
				systemid:request.auth.credentials.SystemId,
				userid:request.auth.credentials.id,
				status:request.payload["mely-post-status"],
				comments:request.payload["mely-post-comments"]
			},function(err,post){
				if(err) reply(err);
				reply("Post Added");
			});
		},
		validate:{
			payload:{
				"mely-post-title": joi.string().required(),
				"mely-post-content": joi.string().required(),
				"mely-post-status": joi.number().required(),
				"mely-post-comments": joi.number().required()
			}
		}
	}
},
{
	method: "PUT",
	path: "/admin/post",
	config:{
		handler: function(request, reply){
			Mely.Post.updatePost({
				id: request.payload["mely-postid"],
				title: request.payload["mely-post-title"],
				content: request.payload["mely-post-content"],
				status: request.payload["mely-post-status"],
				comments: request.payload["mely-post-comments"]
			}, function(err, post){
				if(err) reply(err);
				reply("Post Edited");
			});
		},
		validate:{
			payload:{
				"mely-postid": joi.number().required(),
				"mely-post-title": joi.string().required(),
				"mely-post-content": joi.string().required(),
				"mely-post-status": joi.number().required(),
				"mely-post-comments": joi.number().required()
			}
		}
	}
},
{
	method: "DELETE",
	path: "/admin/post/{id}",
	config:{
		handler: function(request, reply){
			Mely.Post.deletePost({
				id: request.params.id
			}, function(err, user){
				if(err) reply(err);
				reply("Post Deleted");
			});
		},
		validate:{
			params:{
				id: joi.number().required()
			}
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
			Mely.Comment.getComment({
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
	path: "/admin/post/comment/{id}/{direction}",
	config:{
		handler: function(request, reply){
			Mely.Comment.approveComment({
				commentid: request.params["id"],
				direction: request.params["direction"] === "true" ? true : false
			}, function(err, comments){
				if(err) reply(err);
				reply("comment status changed");
			});			
		},
		validate:{
			params:{
				id: joi.number().required(),
				direction: joi.string().required()
			}
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
			Mely.Theme.getTheme({
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
			Mely.Theme.getTheme({
				systemid: request.auth.credentials.SystemId,
				id: request.params.id
			}, function(err, themes){
				if(err) reply(err);
				var theme = {};
				theme.themeID = themes[0].id;
				theme.name = themes[0].name;
				theme.description = themes[0].description;
				Mely.Theme.getThemeSetting({
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
		},
		validate:{
			params:{
				id: joi.number().required()
			}
		}
	}
},
{
	method: "POST",
	path: "/admin/theme",
	config:{
		handler: function(request, reply){
			Mely.Theme.createTheme({
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
		validate:{
			payload:{
				themename: joi.string().required(),
				themedescription: joi.string().required(),
				headerbackcolor: joi.string().regex(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).required(),
				headerfontcolor: joi.string().regex(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).required(),
				headerfontsize: joi.number().greater(0).required(),
				headerimage: joi.any(),
				menubackcolor: joi.string().regex(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).required(),
				menufontcolor: joi.string().regex(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).required(),
				menufontsize: joi.number().greater(0).required(),
				posttitlecolor: joi.string().regex(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).required(),
				posttitlefontsize: joi.number().greater(0).required(),
				postcontentcolor: joi.string().regex(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).required(),
				postcontentfontsize: joi.number().greater(0).required(),
				pagetitlecolor: joi.string().regex(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).required(),
				pagetitlefontsize: joi.number().greater(0).required(),
				pagecontentcolor: joi.string().regex(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).required(),
				pagecontentfontsize: joi.number().greater(0).required()
			}
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
			Mely.Theme.updateTheme({
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
		validate:{
			payload:{
				id: joi.number().required(),
				themename: joi.string().required(),
				themedescription: joi.string().required(),
				headerbackcolor: joi.string().regex(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).required(),
				headerfontcolor: joi.string().regex(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).required(),
				headerfontsize: joi.number().greater(0).required(),
				headerimage: joi.any(),
				menubackcolor: joi.string().regex(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).required(),
				menufontcolor: joi.string().regex(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).required(),
				menufontsize: joi.number().greater(0).required(),
				posttitlecolor: joi.string().regex(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).required(),
				posttitlefontsize: joi.number().greater(0).required(),
				postcontentcolor: joi.string().regex(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).required(),
				postcontentfontsize: joi.number().greater(0).required(),
				pagetitlecolor: joi.string().regex(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).required(),
				pagetitlefontsize: joi.number().greater(0).required(),
				pagecontentcolor: joi.string().regex(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).required(),
				pagecontentfontsize: joi.number().greater(0).required()
			}
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
			Mely.Theme.activateTheme({
				systemid: request.auth.credentials.SystemId,
				id: request.params.id
			}, function(err, theme){
				if(err) reply(err);
				reply("Theme activated")
			});
		},
		validate:{
			params:{
				id: joi.number().required()
			}
		}
	}
},
{
	method: "GET",
	path: "/admin/file",
	config:{
		handler: function(request, reply){
			Mely.Theme.getThemeFiles({
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
			Mely.Theme.getFileContents({
				id: request.params.id
			}, function(err, file){
				if(err) reply(err);
				reply(file);
			});
		},
		validate:{
			params:{
				id: joi.string().required()
			}
		}
	}
},
{
	method: "POST",
	path: "/admin/file/save",
	config:{
		handler: function(request, reply){
			Mely.Theme.writeFileContents({
				filename: request.payload.filename,
				content: request.payload.content
			}, function(err, result){
				if(err) reply(err);
				reply(result);
			});
		},
		validate:{
			payload:{
				filename: joi.string().required(),
				content: joi.string().required()
			}
		}
	}
},
//blog routes
{
	method: "GET",
	path: "/api/post",
	config:{
		handler: function(request, reply){
			Mely.System.getSystem({
			}, function(err, result){
				var blogid = result.id;
				Mely.Post.getPost({
					systemid: blogid,
					status: 2
				}, function(err, posts){
					if(err) reply(err);
					var postList = [];
					for(var post in posts){
						if (posts.hasOwnProperty(post)){
							var row = {};
							row.id = posts[post].id;
							row.userid = posts[post].UserId;
							row.title = posts[post].title;
							row.content = marked(posts[post].content);
							row.createdAt = moment(posts[post].createdAt).format('MMMM Do YYYY h:mm a');
							row.comments_allowed = posts[post].comments_allowed === true ? 1 : 0;
							postList.push(row);
						}
					}
					reply(postList);
				});
			});
		},
		auth: false
	}
},
{
	method: "GET",
	path: "/api/post/{id}",
	config:{
		handler: function(request, reply){
			Mely.System.getSystem({
			}, function(err, result){
				var blogid = result.id;
				Mely.Post.getPost({
					systemid: blogid,
					status: request.query.draft === "" ? 1 : 2,
					id: request.params.id
				}, function(err, posts){
					if(err) reply(err);
					var postList = [];
					for(var post in posts){
						if (posts.hasOwnProperty(post)){
							var row = {};
							row.id = posts[post].id;
							row.userid = posts[post].UserId;
							row.title = posts[post].title;
							row.content = marked(posts[post].content);
							row.createdAt = moment(posts[post].createdAt).format('MMMM Do YYYY h:mm a');
							row.comments_allowed = posts[post].comments_allowed === true ? 1 : 0;
							postList.push(row);
						}
					}
					reply(postList);
				});
			});
		},
		validate:{
			params:{
				id: joi.number().required()
			}
		},
		auth: false
	}
},
{
	method: "GET",
	path: "/api/author/{id}",
	config:{
		handler: function(request, reply){
			Mely.System.getSystem({
			}, function(err, result){
				var blogid = result.id;
				Mely.User.getUser({
					systemid: blogid,
					userid: request.params.id
				}, function(err, user){
					if(err) reply(err);
					reply(user[0].email_address);
				});
			});
		},
		validate:{
			params:{
				id: joi.number().required()
			}
		},
		auth: false
	}
},
{
	method: "GET",
	path: "/api/comment/{id}",
	config:{
		handler: function(request, reply){
			Mely.System.getSystem({
			}, function(err, result){
				var blogid = result.id;
				Mely.Comment.getComment({
					systemid: blogid,
					postid: request.params.id,
					approved: 1
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
							row.upvote = comments[comment].upvote;
							row.downvote = comments[comment].downvote;
							Comments.push(row);
						}
					}
					reply(Comments);
				});
			});
		},
		validate:{
			params:{
				id: joi.number().required()
			}
		},
		auth: false
	}
},
{
	method: "GET",
	path: "/api/page/{pagename}",
	config:{
		handler: function(request, reply){
			Mely.System.getSystem({
			}, function(err, result){
				var blogid = result.id;
				Mely.Page.getPage({
					systemid: blogid,
					status: request.query.draft === "" ? 1 : 2,
					title: request.params.pagename.replace("_"," ")
				}, function(err, page){
					if(err) reply(err);
					var Page = [];
					for (var item in page){
						if (page.hasOwnProperty(item)){
							var pageRecord = {};
							pageRecord.pageTitle = page[item].title;
							pageRecord.pageContent = marked(page[item].content);
							Page.push(pageRecord);
						}
					}
					reply(Page);
				});
			});
		},
		validate:{
			params:{
				pagename: joi.string().required()
			}
		},
		auth: false
	}
},
{
	method: "GET",
	path: "/api/menu",
	config:{
		handler: function(request, reply){
			Mely.System.getSystem({
			}, function(err, result){
				var blogid = result.id;
				Mely.Page.getPage({
					systemid: blogid,
					status: 2
				}, function(err, pages){
					var Pages = [];
					for (var page in pages){
						if (pages.hasOwnProperty(page)){
							if(pages[page].onmenu){
								var pageRecord = {};
								pageRecord.id = pages[page].id;
								pageRecord.title = pages[page].title;
								pageRecord.link = changeCase.lowerCase(pages[page].title.replace(" ","_"));
								pageRecord.onmenu = pages[page].onmenu;
								Pages.push(pageRecord);
							}
						}
					}
					reply(Pages);
				});
			});
		},
		auth: false
	}
},
{
	method: "GET",
	path: "/api/theme",
	config:{
		handler: function(request, reply){
			Mely.System.getSystem({
			}, function(err, result){
				var blogid = result.id;
				Mely.Theme.getTheme({
					systemid: blogid,
					active: true
				}, function(err, theme){
					if(err) reply(err);
					Mely.Theme.getThemeSetting({
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
						reply(themeRecord);
					});
				});
			});
		},
		auth: false
	}
},
{
	method: "GET",
	path: "/",
	config:{
		handler: function(request, reply){
			var pageDetails = {};
			pageDetails.title = "Mely";
			Mely.System.getSystemCount({
			}, function(err, count){
				if(count > 0){
					Mely.System.getSystem({
					}, function(err, system){
						if(err) reply(err);
						pageDetails.system = {
							title: system.name,
							tag: system.description
						};
						reply.view("mely/index", pageDetails);
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
			pageDetails.title = "Mely";
			Mely.System.getSystemCount({
			}, function(err, count){
				if(count > 0){
					Mely.System.getSystem({
					}, function(err, system){
						if(err) reply(err);
						pageDetails.system = {
							title: system.name,
							tag: system.description
						};
						reply.view("mely/page", pageDetails);
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
	path: "/post/{id}",
	config:{
		handler: function(request, reply){
			var pageDetails = {};
			pageDetails.title = "Mely";
			Mely.System.getSystemCount({
			}, function(err, count){
				if(count > 0){
					Mely.System.getSystem({
					}, function(err, system){
						if(err) reply(err);
						pageDetails.system = {
							title: system.name,
							tag: system.description
						};
						reply.view("mely/post", pageDetails);
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
	method: "POST",
	path: "/comment",
	config:{
		handler: function(request, reply){
			Mely.System.getSystem({
			}, function(err, system){
				if(err) reply(err);
				Mely.Comment.createComment({
					systemid: system.id,
					email: request.payload["email"],
					content: request.payload["content"],
					postid: request.payload["postid"]
				}, function(err, comment){
					if(err) reply(err);
					reply().redirect("/post/" + request.payload["postid"] + "#");
				});
			});
		},
		validate:{
			payload:{
				email: joi.string().email().required(),
				content: joi.string().required(),
				postid: joi.number().required()
			}
		},
		auth: false
	}
},
{
	method: "GET",
	path: "/comment/{id}/up",
	config:{
		handler: function(request, reply){
			Mely.Comment.upComment({
				commentid:request.params["id"]
			}, function(err, comment){
				if(err) reply(err);
				reply("Upvoted");
			});
		},
		validate:{
			params:{
				id: joi.number().required()
			}
		},
		auth: false
	}
},
{
	method: "GET",
	path: "/comment/{id}/down",
	config:{
		handler: function(request, reply){
			Mely.Comment.downComment({
				commentid:request.params["id"]
			}, function(err, comment){
				if(err) reply(err);
				reply("Downvoted");
			});
		},
		validate:{
			params:{
				id: joi.number().required()
			}
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
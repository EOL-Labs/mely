var assert = require("assert");
var database = require("../config").database;
var models = require('../lib/models');
var administration = require("../lib/administration");
var Mely = {};
Mely.Administrator = administration;

var email = "test@aol.com";
var email2 = "test@yahoo.com";
var password = "Password1234";
var systemid = 1;
var userid = 1;
var pageid = 1;
var postid = 1;
var commentid = 1;
var themeid = 1;
var directionOfApproval = true;
var title = "My Title";
var content = "My Content";
var published = 1;
var draft = 2;
var deleted = 3;
var markdown = "**b**";
var name = "My Theme";
var description = "My Theme Description";
var melyname = "My Mely Name";
var melydescription = "My Mely Description";

describe("Mely", function(){
	before(function(done){
		var virt_modules = [];
		models.init(virt_modules, function() {
			done();
		});
	});
	describe("#systems", function(){
		describe("#createSystem()",function(){
			it("should return system object", function(done){
				Mely.Administrator.createSystem({
					name: name,
					description: description
				},function(err, system){
					assert(err === null);
					assert(system !== undefined);
					done();
				});
			});
			it("should return error if name is undefined", function(done){
				Mely.Administrator.createSystem({
					description: description
				},function(err, system){
					assert(err instanceof Error);
					assert(system === undefined);
					done();
				});
			});
			it("should return error if description is undefined", function(done){
				Mely.Administrator.createSystem({
					name: name,
				},function(err, system){
					assert(err instanceof Error);
					assert(system === undefined);
					done();
				});
			});
		});
		describe("#getSystemCount()",function(){
			it("should return system count", function(done){
				Mely.Administrator.getSystemCount({
				}, function(err, count){
					assert(err === null);
					assert(count !== undefined);
					done();
				});
			});
		});
		describe("#getSystem()",function(){
			it("should return system object", function(done){
				Mely.Administrator.getSystem({
				}, function(err, system){
					assert(err === null);
					assert(system !== undefined);
					done();
				});
			});
		});
	});
	describe("#users", function(){
		describe("#createUser()", function(){
			it("should return user object", function(done){
				Mely.Administrator.createUser({
					email: email,
					password: password,
					systemid: systemid
				}, function(err, user){
					assert(err === null);
					assert(user !== undefined);
					assert(user.id !== undefined);
					assert(user.email_address !== undefined && user.email_address === email);
					assert(user.password !== undefined && user.password === password);
					assert(user.SystemId !== undefined && user.SystemId === systemid);
					assert(user.status !== undefined && user.status === true);
					done();
				});
			});
			it("should return error when email is undefined", function(done){
				Mely.Administrator.createUser({
					password: password,
					systemid: systemid
				}, function(err, user){
					assert(err instanceof Error);
					assert(user === undefined);
					done();
				});
			});
			it("should return error when is undefined", function(done){
				Mely.Administrator.createUser({
					email: email,
					systemid: systemid
				}, function(err, user){
					assert(err instanceof Error);
					assert(user === undefined);
					done();
				});
			});
			it("should return error when is undefined", function(done){
				Mely.Administrator.createUser({
					email: email,
					password: password
				}, function(err, user){
					assert(err instanceof Error);
					assert(user === undefined);
					done();
				});
			});
		});
		describe("#getUser()",function(){
			it("should return array w/ user objects", function(done){
				Mely.Administrator.getUser({
					systemid: systemid
				}, function(err, users){
					assert(err === null);
					assert(users !== undefined);
					done();
				});
			});
			it("should return array w/ 1 user object", function(done){
				Mely.Administrator.getUser({
					systemid: systemid,
					id: userid
				}, function(err, users){
					assert(users.length === 1);
					assert(err === null);
					assert(users !== undefined);
					done();
				});
			});
			it("should return error when systemid is undefined", function(done){
				Mely.Administrator.getUser({
				}, function(err, users){
					assert(err instanceof Error);
					assert(users === undefined);
					done();
				});
			});
		});
		describe("#updateUser()",function(){
			it("should update user", function(done) {
				Mely.Administrator.updateUser({
					id: userid,
					email: email2
				},function(err, user){
					assert(err === null);
					assert(user !== undefined);
					done();
				});
			});
			it("should return error when id is undefined", function(done){
				Mely.Administrator.updateUser({
					email: email2
				},function(err, user){
					assert(err instanceof Error);
					assert(user === undefined);
					done();
				});
			});
		});
		describe("#loginUser()",function(){
			it("should return user object",function(done){
				Mely.Administrator.loginUser({
					email:email2,
					password: password
				},function(err, user){
					assert(err === null);
					assert(user !== null);
					assert(user.email_address !== undefined && user.email_address === email2);
					done();
				});
			});
			it("should return user === null",function(done){
				Mely.Administrator.loginUser({
					email:email,
					password: password
				},function(err, user){
					assert(err === null);
					assert(user === null);
					done();
				});
			});
			it("should return error when email is undefined",function(done){
				Mely.Administrator.loginUser({
					password: password
				},function(err, user){
					assert(err instanceof Error);
					assert(user === undefined);
					done();
				});
			});
			it("should return error when password is undefined",function(done){
				Mely.Administrator.loginUser({
					email:email
				},function(err, user){
					assert(err instanceof Error);
					assert(user === undefined);
					done();
				});
			});
		});		
		describe("#resetPassword()",function(){
			it("should reset the users password", function(done) {
				Mely.Administrator.resetPassword({
					email: email2,
					password: "ABCDEF1234"
				},function(err, user){
					assert(err === null);
					assert(user !== undefined);
					done();
				});
			});
			it("should return error when email is undefined", function(done){
				Mely.Administrator.resetPassword({
					email: email2
				},function(err, user){
					assert(err instanceof Error);
					assert(user === undefined);
					done();
				});
			});
			it("should return error when password is undefined", function(done){
				Mely.Administrator.resetPassword({
					password: "ABCDEF1234"
				},function(err, user){
					assert(err instanceof Error);
					assert(user === undefined);
					done();
				});
			});
			it("should return error when email is not found", function(done){
				Mely.Administrator.resetPassword({
					email: "noemail@test.com",
					password: "ABCDEF1234"
				},function(err, user){
					assert(err === "No Email");
					done();
				});
			});
		});
		describe("#deleteUser()",function(){
			it("should delete user", function(done) {
				Mely.Administrator.deleteUser({
					id: userid,
				},function(err, user){
					assert(err === null);
					assert(user !== undefined);
					done();
				});
			});
			it("should return error when id is undefined", function(done){
				Mely.Administrator.deleteUser({
				},function(err, user){
					assert(err instanceof Error);
					assert(user === undefined);
					done();
				});
			});
		});
	});
	describe("#pages",function(){
		describe("#createPage()",function(){
			it("should return page object",function(done){
				Mely.Administrator.createPage({
					title: title,
					content: content,
					status: published,
					systemid: systemid,
					userid: userid,
					order: 1,
					menuview: true
				},function(err, page){
					assert(err === null);
					assert(page !== undefined);
					assert(page.id !== undefined);
					assert(page.title !== undefined && page.title === title);
					assert(page.content !== undefined && page.content === content);
					assert(page.StatuId !== undefined && page.StatuId === published);
					assert(page.SystemId !== undefined && page.SystemId === systemid);
					assert(page.UserId !== undefined && page.UserId === userid);
					done();
				});
			});
			it("should return error if title is undefined",function(done){
				Mely.Administrator.createPage({
					content: content,
					status: published,
					systemid: systemid,
					userid: userid,
					order: 1,
					menuview: true
				},function(err, page){
					assert(err instanceof Error);
					assert(page === undefined);
					done();
				});
			});
			it("should return error if content is undefined",function(done){
				Mely.Administrator.createPage({
					title: title,
					status: published,
					systemid: systemid,
					userid: userid,
					order: 1,
					menuview: true
				},function(err, page){
					assert(err instanceof Error);
					assert(page === undefined);
					done();
				});
			});
			it("should return error if systemid is undefined",function(done){
				Mely.Administrator.createPage({
					title: title,
					content: content,
					status: published,
					userid: userid,
					order: 1,
					menuview: true
				},function(err, page){
					assert(err instanceof Error);
					assert(page === undefined);
					done();
				});
			});
			it("should return error if userid is undefined",function(done){
				Mely.Administrator.createPage({
					title: title,
					content: content,
					status: published,
					systemid: systemid,
					order: 1,
					menuview: true
				},function(err, page){
					assert(err instanceof Error);
					assert(page === undefined);
					done();
				});
			});
			it("should return error if order is undefined",function(done){
				Mely.Administrator.createPage({
					title: title,
					content: content,
					systemid: systemid,
					userid: userid,
					order: 1,
					menuview: true
				},function(err, page){
					assert(err instanceof Error);
					assert(page === undefined);
					done();
				});
			});
			it("should return error if status is undefined",function(done){
				Mely.Administrator.createPage({
					title: title,
					content: content,
					systemid: systemid,
					userid: userid,
					order: 1,
					menuview: true
				},function(err, page){
					assert(err instanceof Error);
					assert(page === undefined);
					done();
				});
			});
			it("should return error if menuview is undefined",function(done){
				Mely.Administrator.createPage({
					title: title,
					content: content,
					status: published,
					systemid: systemid,
					userid: userid,
					order: 1
				},function(err, page){
					assert(err instanceof Error);
					assert(page === undefined);
					done();
				});
			});
		});
		describe("#getPage()",function(){
			it("should return array w/ page objects", function(done){
				Mely.Administrator.getPage({
					systemid: systemid
				}, function(err, pages){
					assert(err === null);
					assert(pages !== undefined);
					done();
				});
			});
			it("should return array w/ 1 page object if id is present", function(done){
				Mely.Administrator.getPage({
					systemid: systemid,
					id: pageid
				}, function(err, pages){
					assert(pages.length === 1);
					assert(err === null);
					assert(pages !== undefined);
					done();
				});
			});
			it("should return array w/ 1 page object if title is present", function(done){
				Mely.Administrator.getPage({
					systemid: systemid,
					title: title
				}, function(err, pages){
					assert(pages.length === 1);
					assert(err === null);
					assert(pages !== undefined);
					done();
				});
			});
			it("should return error when systemid is undefined", function(done){
				Mely.Administrator.getPage({
				}, function(err, pages){
					assert(err instanceof Error);
					assert(pages === undefined);
					done();
				});
			});
		});
		describe("#updatePage()",function(){
			it("should update page", function(done){
				Mely.Administrator.updatePage({
					id: pageid,
					title: title,
					content: content,
					status: published,
					order: 2,
					menuview: true
				}, function(err, page){
					assert(err === null);
					assert(page !== undefined);
					done();
				});
			});
			it("should return error when pageid is undefined", function(done){
				Mely.Administrator.updatePage({
					title: title,
					content: content,
					status: published,
					order: 2,
					menuview: true
				}, function(err, page){
					assert(err instanceof Error);
					assert(page === undefined);
					done();
				});
			});
			it("should return error when title is undefined", function(done){
				Mely.Administrator.updatePage({
					id: pageid,
					content: content,
					status: published,
					order: 2,
					menuview: true
				}, function(err, page){
					assert(err instanceof Error);
					assert(page === undefined);
					done();
				});
			});
			it("should return error when content is undefined", function(done){
				Mely.Administrator.updatePage({
					id: pageid,
					title: title,
					status: published,
					order: 2,
					menuview: true
				}, function(err, page){
					assert(err instanceof Error);
					assert(page === undefined);
					done();
				});
			});
			it("should return error when status is undefined", function(done){
				Mely.Administrator.updatePage({
					id: pageid,
					title: title,
					content: content,
					order: 2,
					menuview: true
				}, function(err, page){
					assert(err instanceof Error);
					assert(page === undefined);
					done();
				});
			});
			it("should return error when order is undefined", function(done){
				Mely.Administrator.updatePage({
					id: pageid,
					title: title,
					content: content,
					status: published,
					menuview: true
				}, function(err, page){
					assert(err instanceof Error);
					assert(page === undefined);
					done();
				});
			});
			it("should return error when menuview is undefined", function(done){
				Mely.Administrator.updatePage({
					id: pageid,
					title: title,
					content: content,
					status: published,
					order: 2
				}, function(err, page){
					assert(err instanceof Error);
					assert(page === undefined);
					done();
				});
			});
		});
	});
	describe("#posts",function(){
		describe("#createPost()",function(){
			it("should return post object",function(done){
				Mely.Administrator.createPost({
					title: title,
					content: content,
					status: published,
					systemid: systemid,
					userid: userid
				},function(err, post){
					assert(err === null);
					assert(post !== undefined);
					assert(post.id !== undefined);
					assert(post.title !== undefined && post.title === title);
					assert(post.content !== undefined && post.content === content);
					assert(post.StatuId !== undefined && post.StatuId === published);
					assert(post.SystemId !== undefined && post.SystemId === systemid);
					assert(post.UserId !== undefined && post.UserId === userid);
					done();
				});
			});
			it("should return error if title is undefined",function(done){
				Mely.Administrator.createPost({
					content: content,
					status: published,
					systemid: systemid,
					userid: userid
				},function(err, post){
					assert(err instanceof Error);
					assert(post === undefined);
					done();
				});
			});
			it("should return error if content is undefined",function(done){
				Mely.Administrator.createPost({
					title: title,
					status: published,
					systemid: systemid,
					userid: userid
				},function(err, post){
					assert(err instanceof Error);
					assert(post === undefined);
					done();
				});
			});
			it("should return error if systemid is undefined",function(done){
				Mely.Administrator.createPost({
					title: title,
					content: content,
					status: published,
					userid: userid
				},function(err, post){
					assert(err instanceof Error);
					assert(post === undefined);
					done();
				});
			});
			it("should return error if userid is undefined",function(done){
				Mely.Administrator.createPost({
					title: title,
					content: content,
					status: published,
					systemid: systemid
				},function(err, post){
					assert(err instanceof Error);
					assert(post === undefined);
					done();
				});
			});
			it("should return error if status is undefined",function(done){
				Mely.Administrator.createPost({
					title: title,
					content: content,
					systemid: systemid,
					userid: userid
				},function(err, post){
					assert(err instanceof Error);
					assert(post === undefined);
					done();
				});
			});
		});
		describe("#getPost()",function(){
			it("should return array w/ post objects", function(done){
				Mely.Administrator.getPost({
					systemid: systemid
				}, function(err, posts){
					assert(err === null);
					assert(posts !== undefined);
					done();
				});
			});
			it("should return array w/ 1 post object", function(done){
				Mely.Administrator.getPost({
					systemid: systemid,
					id: postid
				}, function(err, posts){
					assert(posts.length === 1);
					assert(err === null);
					assert(posts !== undefined);
					done();
				});
			});
			it("should return error when systemid is undefined", function(done){
				Mely.Administrator.getPost({
				}, function(err, posts){
					assert(err instanceof Error);
					assert(posts === undefined);
					done();
				});
			});
		});
		describe("#updatePost()",function(){
			it("should update post", function(done){
				Mely.Administrator.updatePost({
					id: postid,
					title: title,
					content: content,
					status: published
				}, function(err, post){
					assert(err === null);
					assert(post !== undefined);
					done();
				});
			});
			it("should return error when postid is undefined", function(done){
				Mely.Administrator.updatePost({
					title: title,
					content: content,
					status: published
				}, function(err, post){
					assert(err instanceof Error);
					assert(post === undefined);
					done();
				});
			});
			it("should return error when title is undefined", function(done){
				Mely.Administrator.updatePost({
					id: postid,
					content: content,
					status: published
				}, function(err, post){
					assert(err instanceof Error);
					assert(post === undefined);
					done();
				});
			});
			it("should return error when content is undefined", function(done){
				Mely.Administrator.updatePost({
					id: postid,
					title: title,
					status: published
				}, function(err, post){
					assert(err instanceof Error);
					assert(post === undefined);
					done();
				});
			});
			it("should return error when status is undefined", function(done){
				Mely.Administrator.updatePost({
					id: postid,
					title: title,
					content: content
				}, function(err, post){
					assert(err instanceof Error);
					assert(post === undefined);
					done();
				});
			});
		});
	});
	describe("#themes",function(){
		describe("#createTheme()",function(){
			it("should return theme object", function(done){
				Mely.Administrator.createTheme({
					name: name,
					description: description,
					systemid: systemid,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err === null);
					assert(theme !== undefined);
					done();
				});
			});
			it("should return error when name is undefined", function(done){
				Mely.Administrator.createTheme({
					description: description,
					systemid: systemid,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when description is undefined", function(done){
				Mely.Administrator.createTheme({
					name: name,
					systemid: systemid,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when systemid is undefined", function(done){
				Mely.Administrator.createTheme({
					name: name,
					description: description,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when headback is undefined", function(done){
				Mely.Administrator.createTheme({
					name: name,
					description: description,
					systemid: systemid,
					logo: "c:/file.png",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when headfontcolor is undefined", function(done){
				Mely.Administrator.createTheme({
					name: name,
					description: description,
					systemid: systemid,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when headfontsize is undefined", function(done){
				Mely.Administrator.createTheme({
					name: name,
					description: description,
					systemid: systemid,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when menuback is undefined", function(done){
				Mely.Administrator.createTheme({
					name: name,
					description: description,
					systemid: systemid,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when menufontcolor is undefined", function(done){
				Mely.Administrator.createTheme({
					name: name,
					description: description,
					systemid: systemid,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when menufontsize is undefined", function(done){
				Mely.Administrator.createTheme({
					name: name,
					description: description,
					systemid: systemid,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when posttitlecolor is undefined", function(done){
				Mely.Administrator.createTheme({
					name: name,
					description: description,
					systemid: systemid,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when posttitlesize is undefined", function(done){
				Mely.Administrator.createTheme({
					name: name,
					description: description,
					systemid: systemid,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when postcontentcolor is undefined", function(done){
				Mely.Administrator.createTheme({
					name: name,
					description: description,
					systemid: systemid,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when postcontentsize is undefined", function(done){
				Mely.Administrator.createTheme({
					name: name,
					description: description,
					systemid: systemid,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when pagetitlecolor is undefined", function(done){
				Mely.Administrator.createTheme({
					name: name,
					description: description,
					systemid: systemid,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when pagetitlesize is undefined", function(done){
				Mely.Administrator.createTheme({
					name: name,
					description: description,
					systemid: systemid,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when pagecontentcolor is undefined", function(done){
				Mely.Administrator.createTheme({
					name: name,
					description: description,
					systemid: systemid,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when pagecontentsize is undefined", function(done){
				Mely.Administrator.createTheme({
					name: name,
					description: description,
					systemid: systemid,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
		});
		describe("#getTheme()",function(){
			it("should return array w/ theme objects", function(done){
				Mely.Administrator.getTheme({
					systemid: systemid
				}, function(err, themes){
					assert(err === null);
					assert(themes !== undefined);
					done();
				});
			});
			it("should return array w/ 1 theme object", function(done){
				Mely.Administrator.getTheme({
					systemid: systemid,
					id: themeid
				}, function(err, themes){
					assert(themes.length === 1);
					assert(err === null);
					assert(themes !== undefined);
					done();
				});
			});
			it("should return error when systemid is undefined", function(done){
				Mely.Administrator.getUser({
				}, function(err, themes){
					assert(err instanceof Error);
					assert(themes === undefined);
					done();
				});
			});
		});
		describe("#getThemeSetting()",function(){
			it("should return array w/ 1 theme setting object", function(done){
				Mely.Administrator.getThemeSetting({
					id: themeid
				}, function(err, themesetting){
					assert(err === null);
					assert(themesetting !== undefined);
					done();
				});
			});
			it("should return error when id is undefined", function(done){
				Mely.Administrator.getThemeSetting({
				}, function(err, themesetting){
					assert(err instanceof Error);
					assert(themesetting === undefined);
					done();
				});
			});
		});
		describe("#updateTheme()",function(){
			it("should update theme", function(done){
				Mely.Administrator.updateTheme({
					id: themeid,
					name: name,
					description: description,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err === null);
					assert(theme !== undefined);
					done();
				});
			});
			it("should return error when name is undefined", function(done){
				Mely.Administrator.updateTheme({
					id: themeid,
					description: description,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when description is undefined", function(done){
				Mely.Administrator.updateTheme({
					id: themeid,
					name: name,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when id is undefined", function(done){
				Mely.Administrator.updateTheme({
					name: name,
					description: description,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when headback is undefined", function(done){
				Mely.Administrator.updateTheme({
					id: themeid,
					name: name,
					description: description,
					logo: "c:/file.png",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when headfontcolor is undefined", function(done){
				Mely.Administrator.updateTheme({
					id: themeid,
					name: name,
					description: description,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when headfontsize is undefined", function(done){
				Mely.Administrator.updateTheme({
					id: themeid,
					name: name,
					description: description,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when menuback is undefined", function(done){
				Mely.Administrator.updateTheme({
					id: themeid,
					name: name,
					description: description,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when menufontcolor is undefined", function(done){
				Mely.Administrator.updateTheme({
					id: themeid,
					name: name,
					description: description,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when menufontsize is undefined", function(done){
				Mely.Administrator.updateTheme({
					id: themeid,
					name: name,
					description: description,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when posttitlecolor is undefined", function(done){
				Mely.Administrator.updateTheme({
					id: themeid,
					name: name,
					description: description,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when posttitlesize is undefined", function(done){
				Mely.Administrator.updateTheme({
					id: themeid,
					name: name,
					description: description,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when postcontentcolor is undefined", function(done){
				Mely.Administrator.updateTheme({
					id: themeid,
					name: name,
					description: description,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when postcontentsize is undefined", function(done){
				Mely.Administrator.updateTheme({
					id: themeid,
					name: name,
					description: description,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when pagetitlecolor is undefined", function(done){
				Mely.Administrator.updateTheme({
					id: themeid,
					name: name,
					description: description,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlesize:"12",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when pagetitlesize is undefined", function(done){
				Mely.Administrator.updateTheme({
					id: themeid,
					name: name,
					description: description,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagecontentcolor:"000000",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when pagecontentcolor is undefined", function(done){
				Mely.Administrator.updateTheme({
					id: themeid,
					name: name,
					description: description,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentsize:"12",
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when pagecontentsize is undefined", function(done){
				Mely.Administrator.updateTheme({
					id: themeid,
					name: name,
					description: description,
					logo: "c:/file.png",
					headback:"FFFFFF",
					headfontcolor:"000000",
					headfontsize:"12",
					menuback:"FFFFFF",
					menufontcolor:"000000",
					menufontsize:"12",
					posttitlecolor:"000000",
					posttitlesize:"12",
					postcontentcolor:"000000",
					postcontentsize:"12",
					pagetitlecolor:"000000",
					pagetitlesize:"12",
					pagecontentcolor:"000000"
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
		});
		describe("#activateTheme()",function(){
			it("should activate theme", function(done){
				Mely.Administrator.activateTheme({
					systemid: systemid,
					id: themeid
				}, function(err, theme){
					assert(err === null);
					assert(theme !== undefined);
					done();
				});
			});
			it("should return error when systemid is undefined", function(done){
				Mely.Administrator.activateTheme({
					id: themeid
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when id is undefined", function(done){
				Mely.Administrator.activateTheme({
					systemid: systemid
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
		});
	});
	describe("#functions", function(){
		describe("#parseMarkdown()",function(){
			it("should return HTML from markdown", function(done){
				Mely.Administrator.parseMarkdown({
					content: markdown
				},function(err, HTML){
					assert(err === null);
					assert(HTML !== undefined);
					assert(HTML !== markdown);
					done();
				});
			});
			it("should return error when markdown is undefined", function(done){
				Mely.Administrator.parseMarkdown({
				},function(err, HTML){
					assert(err instanceof Error);
					assert(HTML === undefined);
					done();
				});
			});
		});
		describe("#getStatus()", function(){
			it("should return status objects", function(done){
				Mely.Administrator.getStatus({
				}, function(err, status){
					assert(err === null);
					assert(status !== undefined);
					done();
				});
			});
		});
		describe("#getThemeFiles()", function(){
			it("should return array of file name objects", function(done){
				Mely.Administrator.getThemeFiles({
				}, function(err, files){
					assert(err === null);
					assert(files !== undefined);
					done();
				});
			});
		});
	});
	describe("#comments",function(){
		describe("#createComment()",function(){
			it("should return comment object",function(done){
				Mely.Administrator.createComment({
					systemid: systemid,
					email: email,
					content: content,
					postid: postid
				},function(err, comment){
					assert(err === null);
					assert(comment !== undefined);
					assert(comment.id !== undefined);
					assert(comment.email !== undefined && comment.email === email);
					assert(comment.content !== undefined && comment.content === content);
					assert(comment.PostId !== undefined && comment.PostId === postid);
					done();
				});
			});
			it("should return error if email is undefined",function(done){
				Mely.Administrator.createComment({
					systemid: systemid,
					content: content,
					postid: postid
				},function(err, comment){
					assert(err instanceof Error);
					assert(comment === undefined);
					done();
				});
			});
			it("should return error if content is undefined",function(done){
				Mely.Administrator.createComment({
					systemid: systemid,
					email: email,
					postid: postid
				},function(err, comment){
					assert(err instanceof Error);
					assert(comment === undefined);
					done();
				});
			});
			it("should return error if postid is undefined",function(done){
				Mely.Administrator.createComment({
					systemid: systemid,
					email: email,
					content: content
				},function(err, comment){
					assert(err instanceof Error);
					assert(comment === undefined);
					done();
				});
			});
			it("should return error if systemid is undefined",function(done){
				Mely.Administrator.createComment({
					email: email,
					content: content,
					postid: postid
				},function(err, comment){
					assert(err instanceof Error);
					assert(comment === undefined);
					done();
				});
			});
		});
		describe("#getComment()",function(){
			it("should return array w/ ALL comment objects", function(done){
				Mely.Administrator.getComment({
					systemid: systemid
				}, function(err, comments){
					assert(err === null);
					assert(comments !== undefined);
					done();
				});
			});
			it("should return array w/ approved comment objects ONLY of postid", function(done){
				Mely.Administrator.getComment({
					systemid: systemid,
					postid: postid,
					approved: true
				}, function(err, comments){
					for(var item in comments){
						assert(comments[item].postid === postid);
					}
					assert(err === null);
					assert(comments !== undefined);
					done();
				});
			});
			it("should return error when systemid is undefined", function(done){
				Mely.Administrator.getComment({
				}, function(err, comments){
					assert(err instanceof Error);
					assert(comments === undefined);
					done();
				});
			});
		});
		describe("#approveComment()",function(){
			it("should approve comment", function(done){
				Mely.Administrator.approveComment({
					commentid: commentid,
					direction: directionOfApproval
				}, function(err, comment){
					assert(err === null);
					assert(comment !== undefined);
					done();
				});
			});
			it("should return error when commentid is undefined", function(done){
				Mely.Administrator.approveComment({
					direction: directionOfApproval
				}, function(err, comment){
					assert(err instanceof Error);
					assert(comment === undefined);
					done();
				});
			});
			it("should return error when direction is undefined", function(done){
				Mely.Administrator.approveComment({
					commentid: commentid
				}, function(err, comment){
					assert(err instanceof Error);
					assert(comment === undefined);
					done();
				});
			});
		});
		describe("#upComment()",function(){
			it("should upvote comment", function(done){
				Mely.Administrator.upComment({
					commentid: commentid,
				}, function(err, comment){
					assert(err === null);
					assert(comment !== undefined);
					done();
				});
			});
			it("should return error when commentid is undefined", function(done){
				Mely.Administrator.upComment({
				}, function(err, comment){
					assert(err instanceof Error);
					assert(comment === undefined);
					done();
				});
			});
		});
		describe("#downComment()",function(){
			it("should upvote comment", function(done){
				Mely.Administrator.downComment({
					commentid: commentid,
				}, function(err, comment){
					assert(err === null);
					assert(comment !== undefined);
					done();
				});
			});
			it("should return error when commentid is undefined", function(done){
				Mely.Administrator.downComment({
				}, function(err, comment){
					assert(err instanceof Error);
					assert(comment === undefined);
					done();
				});
			});
		});
	});
});
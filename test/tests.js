var assert = require("assert");
var database = require("../config").database;
var models = require('../lib/models');
var administration = require("../lib/administration");
var Mely = {};
Mely.Administrator = administration;

var email = "test@test.com";
var email2 = "test2@test.com";
var password = "test";
var systemid = 1;
var userid = 1;
var pageid = 1;
var postid = 1;
var themeid = 1;
var title = "New Title";
var content = "New Content";
var published = 1;
var draft = 2;
var deleted = 3;
var markdown = "**b**";
var markdownHTML = "<p><strong>b</strong></p>";
var name = "New Theme";
var description = "New Theme Description";
var melyname = "Test Mely Name";
var melydescription = "Test Mely Description";

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
			it("should return error if name === null", function(done){
				Mely.Administrator.createSystem({
					name: null,
					description: description
				},function(err, system){
					assert(err instanceof Error);
					assert(system === undefined);
					done();
				});
			});
			it("should return error if description === null", function(done){
				Mely.Administrator.createSystem({
					name: name,
					description: null
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
			it("should return error when email === null", function(done){
				Mely.Administrator.createUser({
					email: null,
					password: password,
					systemid: systemid
				}, function(err, user){
					assert(err instanceof Error);
					assert(user === undefined);
					done();
				});
			});
			it("should return error when password === null", function(done){
				Mely.Administrator.createUser({
					email: email,
					password: null,
					systemid: systemid
				}, function(err, user){
					assert(err instanceof Error);
					assert(user === undefined);
					done();
				});
			});
			it("should return error when systemid === null", function(done){
				Mely.Administrator.createUser({
					email: email,
					password: password,
					systemid: null
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
			it("should return error when systemid === null", function(done){
				Mely.Administrator.getUser({
					systemid: null
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
			it("should return error when id === null", function(done){
				Mely.Administrator.updateUser({
					id: null,
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
			it("should return error when email === null",function(done){
				Mely.Administrator.loginUser({
					email:null,
					password: password
				},function(err, user){
					assert(err instanceof Error);
					assert(user === undefined);
					done();
				});
			});
			it("should return error when password === null",function(done){
				Mely.Administrator.loginUser({
					email:email,
					password: null
				},function(err, user){
					assert(err instanceof Error);
					assert(user === undefined);
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
			it("should return error when id === null", function(done){
				Mely.Administrator.deleteUser({
					id: null
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
					order: 1
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
			it("should return error if title === null",function(done){
				Mely.Administrator.createPage({
					title: null,
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
			it("should return error if content === null",function(done){
				Mely.Administrator.createPage({
					title: title,
					content: null,
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
			it("should return error if systemid === null",function(done){
				Mely.Administrator.createPage({
					title: title,
					content: content,
					status: published,
					systemid: null,
					userid: userid,
					order: 1
				},function(err, page){
					assert(err instanceof Error);
					assert(page === undefined);
					done();
				});
			});
			it("should return error if userid === null",function(done){
				Mely.Administrator.createPage({
					title: title,
					content: content,
					status: published,
					systemid: systemid,
					userid: null,
					order: 1
				},function(err, page){
					assert(err instanceof Error);
					assert(page === undefined);
					done();
				});
			});
			it("should return error if status === null",function(done){
				Mely.Administrator.createPage({
					title: title,
					content: content,
					status: null,
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
					title: "New Title"
				}, function(err, pages){
					assert(pages.length === 1);
					assert(err === null);
					assert(pages !== undefined);
					done();
				});
			});
			it("should return error when systemid === null", function(done){
				Mely.Administrator.getPage({
					systemid: null
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
					order: 2
				}, function(err, page){
					assert(err === null);
					assert(page !== undefined);
					done();
				});
			});
			it("should return error when pageid === null", function(done){
				Mely.Administrator.updatePage({
					id: null,
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
			it("should return error when title === null", function(done){
				Mely.Administrator.updatePage({
					id: pageid,
					title: null,
					content: content,
					status: published,
					order: 2
				}, function(err, page){
					assert(err instanceof Error);
					assert(page === undefined);
					done();
				});
			});
			it("should return error when content === null", function(done){
				Mely.Administrator.updatePage({
					id: pageid,
					title: title,
					content: null,
					status: published,
					order: 2
				}, function(err, page){
					assert(err instanceof Error);
					assert(page === undefined);
					done();
				});
			});
			it("should return error when status === null", function(done){
				Mely.Administrator.updatePage({
					id: pageid,
					title: title,
					content: content,
					status: null,
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
			it("should return error if title === null",function(done){
				Mely.Administrator.createPost({
					title: null,
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
			it("should return error if content === null",function(done){
				Mely.Administrator.createPost({
					title: title,
					content: null,
					status: published,
					systemid: systemid,
					userid: userid
				},function(err, post){
					assert(err instanceof Error);
					assert(post === undefined);
					done();
				});
			});
			it("should return error if systemid === null",function(done){
				Mely.Administrator.createPost({
					title: title,
					content: content,
					status: published,
					systemid: null,
					userid: userid
				},function(err, post){
					assert(err instanceof Error);
					assert(post === undefined);
					done();
				});
			});
			it("should return error if userid === null",function(done){
				Mely.Administrator.createPost({
					title: title,
					content: content,
					status: published,
					systemid: systemid,
					userid: null
				},function(err, post){
					assert(err instanceof Error);
					assert(post === undefined);
					done();
				});
			});
			it("should return error if status === null",function(done){
				Mely.Administrator.createPost({
					title: title,
					content: content,
					status: null,
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
			it("should return error when systemid === null", function(done){
				Mely.Administrator.getPost({
					systemid: null
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
			it("should return error when postid === null", function(done){
				Mely.Administrator.updatePost({
					id: null,
					title: title,
					content: content,
					status: published
				}, function(err, post){
					assert(err instanceof Error);
					assert(post === undefined);
					done();
				});
			});
			it("should return error when title === null", function(done){
				Mely.Administrator.updatePost({
					id: postid,
					title: null,
					content: content,
					status: published
				}, function(err, post){
					assert(err instanceof Error);
					assert(post === undefined);
					done();
				});
			});
			it("should return error when content === null", function(done){
				Mely.Administrator.updatePost({
					id: postid,
					title: title,
					content: null,
					status: published
				}, function(err, post){
					assert(err instanceof Error);
					assert(post === undefined);
					done();
				});
			});
			it("should return error when status === null", function(done){
				Mely.Administrator.updatePost({
					id: postid,
					title: title,
					content: content,
					status: null
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
			it("should return error when name === null", function(done){
				Mely.Administrator.createTheme({
					name: null,
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
			it("should return error when description === null", function(done){
				Mely.Administrator.createTheme({
					name: name,
					description: null,
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
			it("should return error when systemid === null", function(done){
				Mely.Administrator.getUser({
					systemid: null
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
			it("should return error when id === null", function(done){
				Mely.Administrator.getThemeSetting({
					id: null
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
			it("should return error when name === null", function(done){
				Mely.Administrator.updateTheme({
					id: themeid,
					name: null,
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
			it("should return error when description === null", function(done){
				Mely.Administrator.updateTheme({
					id: themeid,
					name: name,
					description: null,
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
			it("should return error when themeid === null", function(done){
				Mely.Administrator.updateTheme({
					id: null,
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
			it("should return error when systemid === null", function(done){
				Mely.Administrator.activateTheme({
					systemid: null,
					id: themeid
				}, function(err, theme){
					assert(err instanceof Error);
					assert(theme === undefined);
					done();
				});
			});
			it("should return error when id === null", function(done){
				Mely.Administrator.activateTheme({
					systemid: systemid,
					id: null
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
					//assert(HTML === markdownHTML);
					done();
				});
			});
			it("should return error when markdown = null", function(done){
				Mely.Administrator.parseMarkdown({
					content: null
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
});
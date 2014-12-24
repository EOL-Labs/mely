var Code = require("code");
var Lab = require("lab");
var models = require("../lib/models");
var database = require("../config").database;
var Mely = {};
Mely.Administrator = require("../lib/administration");
var lab = exports.lab = Lab.script();

//set values
var email = "test@aol.com";
var password = "Password1234";
var systemid = 1;
var email2 = "test@yahoo.com";
var userid = 1;
var title = "My Title";
var content = "My Content";
var published = 1;
var pageid = 1;
var postid = 1;
var name = "My Theme";
var description = "My Theme Description";
var themeid = 1;
var commentid = 1;
var directionOfApproval = true;

lab.experiment("Mely Tests", function(){
	lab.before(function(done){
		var virt_modules = [];
		models.init(virt_modules, function() {
			done();
		});
    });
    lab.experiment("Systems", function(){
    	lab.experiment("CreateSystem()", function(){
	    	lab.test("CreateSystem() w/ valid information", function(done){
				Mely.Administrator.createSystem({
					name: "Tests",
					description: "Tests"
				},function(err, system){
					Code.expect(err).to.be.null();
					Code.expect(system).to.not.equal(undefined);
					done();
				});
			});
			lab.test("CreateSystem() w/ missing name", function(done){
	    		Mely.Administrator.createSystem({
					description: "Tests"
				},function(err, system){
					Code.expect(system).to.be.undefined();
					Code.expect(err).to.be.an.instanceof(Error);
					done();
				});
			});
		});
	});
	lab.experiment("Users", function(){
		lab.experiment("CreateUser()", function(){
	    	lab.test("should return user object", function(done){
	    		Mely.Administrator.createUser({
					email: email,
					password: password,
					systemid: systemid
				}, function(err, user){
					Code.expect(err).to.be.null();
					Code.expect(user).to.not.equal(undefined);
					Code.expect(user.email_address).to.equal(email);
					Code.expect(user.password).to.equal(password);
					Code.expect(user.SystemId).to.equal(systemid);
					Code.expect(user.status).to.equal(true);
					done();
				});
			});
			lab.test("should return error when email is undefined", function(done){
	    		Mely.Administrator.createUser({
					password: password,
					systemid: systemid
				}, function(err, user){
					Code.expect(user).to.be.undefined();
					Code.expect(err).to.be.an.instanceof(Error);
					done();
				});
			});
			lab.test("should return error when password is undefined", function(done){
	    		Mely.Administrator.createUser({
					email: email,
					systemid: systemid
				}, function(err, user){
					Code.expect(user).to.be.undefined();
					Code.expect(err).to.be.an.instanceof(Error);
					done();
				});
			});
			lab.test("should return error when email is undefined", function(done){
	    		Mely.Administrator.createUser({
	    			email: email,
					password: password
				}, function(err, user){
					Code.expect(user).to.be.undefined();
					Code.expect(err).to.be.an.instanceof(Error);
					done();
				});
			});
		});
		lab.experiment("GetUser()", function(){
			lab.test("should return array w/ user objects", function(done){
				Mely.Administrator.getUser({
					systemid: systemid
				}, function(err, users){
					Code.expect(err).to.be.null();
					Code.expect(users).to.not.equal(undefined);
					done();
				});
			});
			lab.test("should return error when systemid is undefined", function(done){
				Mely.Administrator.getUser({
				}, function(err, users){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(users).to.be.undefined();
					done();
				});
			});
		});
		lab.experiment("LoginUser()", function(){
			lab.test("should return user object", function(done){
				Mely.Administrator.loginUser({
					email:email,
					password: password
				},function(err, user){
					Code.expect(err).to.be.null();
					Code.expect(user).to.not.equal(undefined);
					Code.expect(user.email_address).to.equal(email);
					done();
				});
			});
			lab.test("should return user === null", function(done){
				Mely.Administrator.loginUser({
					email:email2,
					password: password
				},function(err, user){
					Code.expect(err).to.be.null();
					Code.expect(user).to.be.null();
					done();
				});
			});
			lab.test("should return error when email is undefined", function(done){
				Mely.Administrator.loginUser({
					password: password
				},function(err, user){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(user).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when password is undefined", function(done){
				Mely.Administrator.loginUser({
					email:email
				},function(err, user){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(user).to.be.undefined();
					done();
				});
			});
		});
		lab.experiment("ResetPassword()", function(){
			lab.test("should reset the users password", function(done){
				Mely.Administrator.resetPassword({
					email: email,
					password: "ABCDEF1234"
				},function(err, user){
					Code.expect(err).to.be.null();
					Code.expect(user).to.not.equal(undefined);
					done();
				});
			});
			lab.test("should return error when email is undefined", function(done){
				Mely.Administrator.resetPassword({
					email: email2
				},function(err, user){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(user).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when password is undefined", function(done){
				Mely.Administrator.resetPassword({
					password: "ABCDEF1234"
				},function(err, user){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(user).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when email is not found", function(done){
				Mely.Administrator.resetPassword({
					email: "noemail@test.com",
					password: "ABCDEF1234"
				},function(err, user){
					Code.expect(err).to.equal("No Email");
					done();
				});
			});
		});
		lab.experiment("DeleteUser()", function(){
			lab.test("should delete user", function(done){
				Mely.Administrator.deleteUser({
					id: userid,
				},function(err, user){
					Code.expect(err).to.be.null();
					Code.expect(user).to.not.equal(undefined);
					done();
				});
			});
			lab.test("should return error when id is undefined", function(done){
				Mely.Administrator.deleteUser({
				},function(err, user){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(user).to.be.undefined();
					done();
				});
			});
		});
	});
	lab.experiment("Pages", function(){
		lab.experiment("CreatePage()", function(){
			lab.test("should return page object", function(done){
				Mely.Administrator.createPage({
					title: title,
					content: content,
					status: published,
					systemid: systemid,
					userid: userid,
					order: 1,
					menuview: 1
				},function(err, page){
					Code.expect(err).to.be.null();
					Code.expect(page).to.not.equal(undefined);
					Code.expect(page.title).to.equal(title);
					Code.expect(page.content).to.equal(content);
					Code.expect(page.status).to.equal(published);
					Code.expect(page.SystemId).to.equal(systemid);
					Code.expect(page.UserId).to.equal(userid);
					done();
				});
			});
			lab.test("should return error if title is undefined", function(done){
				Mely.Administrator.createPage({
					content: content,
					status: published,
					systemid: systemid,
					userid: userid,
					order: 1,
					menuview: 1
				},function(err, page){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(page).to.be.undefined();
					done();
				});
			});
			lab.test("should return error if content is undefined", function(done){
				Mely.Administrator.createPage({
					title: title,
					status: published,
					systemid: systemid,
					userid: userid,
					order: 1,
					menuview: 1
				},function(err, page){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(page).to.be.undefined();
					done();
				});
			});
			lab.test("should return error if systemid is undefined", function(done){
				Mely.Administrator.createPage({
					title: title,
					content: content,
					status: published,
					userid: userid,
					order: 1,
					menuview: 1
				},function(err, page){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(page).to.be.undefined();
					done();
				});
			});
			lab.test("should return error if userid is undefined", function(done){
				Mely.Administrator.createPage({
					title: title,
					content: content,
					status: published,
					systemid: systemid,
					order: 1,
					menuview: 1
				},function(err, page){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(page).to.be.undefined();
					done();
				});
			});
			lab.test("should return error if order is undefined", function(done){
				Mely.Administrator.createPage({
					title: title,
					content: content,
					systemid: systemid,
					userid: userid,
					order: 1,
					menuview: 1
				},function(err, page){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(page).to.be.undefined();
					done();
				});
			});
			lab.test("should return error if status is undefined", function(done){
				Mely.Administrator.createPage({
					title: title,
					content: content,
					systemid: systemid,
					userid: userid,
					order: 1,
					menuview: 1
				},function(err, page){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(page).to.be.undefined();
					done();
				});
			});
		});
		lab.experiment("GetPage()", function(){
			lab.test("should return array w/ page objects", function(done){
				Mely.Administrator.getPage({
					systemid: systemid
				}, function(err, pages){
					Code.expect(err).to.be.null();
					Code.expect(pages).to.not.equal(undefined);
					done();
				});
			});
			lab.test("should return array w/ 1 page object if id is present", function(done){
				Mely.Administrator.getPage({
					systemid: systemid,
					id: pageid
				}, function(err, pages){
					Code.expect(pages).to.be.an.array();
					Code.expect(err).to.be.null();
					Code.expect(pages).to.not.equal(undefined);
					done();
				});
			});
			lab.test("should return array w/ 1 page object if title is present", function(done){
				Mely.Administrator.getPage({
					systemid: systemid,
					title: title
				}, function(err, pages){
					Code.expect(pages).to.be.an.array();
					Code.expect(err).to.be.null();
					done();
				});
			});
			lab.test("should return error when systemid is undefined", function(done){
				Mely.Administrator.getPage({
				}, function(err, pages){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(pages).to.be.undefined();
					done();
				});
			});
		});
		lab.experiment("UpdatePage()", function(){
			lab.test("should update page", function(done){
				Mely.Administrator.updatePage({
					id: pageid,
					title: title,
					content: content,
					status: published,
					order: 2,
					menuview: true
				}, function(err, page){
					Code.expect(err).to.be.null();
					Code.expect(page).to.not.equal(undefined);
					done();
				});
			});
			lab.test("should return error when pageid is undefined", function(done){
				Mely.Administrator.updatePage({
					title: title,
					content: content,
					status: published,
					order: 2,
					menuview: true
				}, function(err, page){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(page).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when title is undefined", function(done){
				Mely.Administrator.updatePage({
					id: pageid,
					content: content,
					status: published,
					order: 2,
					menuview: true
				}, function(err, page){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(page).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when content is undefined", function(done){
				Mely.Administrator.updatePage({
					id: pageid,
					title: title,
					status: published,
					order: 2,
					menuview: true
				}, function(err, page){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(page).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when status is undefined", function(done){
				Mely.Administrator.updatePage({
					id: pageid,
					title: title,
					content: content,
					order: 2,
					menuview: true
				}, function(err, page){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(page).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when order is undefined", function(done){
				Mely.Administrator.updatePage({
					id: pageid,
					title: title,
					content: content,
					status: published,
					menuview: true
				}, function(err, page){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(page).to.be.undefined();
					done();
				});
			});
		});
	});
	lab.experiment("Posts", function(){
		lab.experiment("CreatePost()", function(){
			lab.test("should return post object", function(done){
				Mely.Administrator.createPost({
					title: title,
					content: content,
					status: published,
					systemid: systemid,
					userid: userid
				},function(err, post){
					Code.expect(err).to.be.null();
					Code.expect(post).to.not.equal(undefined);
					Code.expect(post.title).to.equal(title);
					Code.expect(post.content).to.equal(content);
					Code.expect(post.status).to.equal(published);
					Code.expect(post.SystemId).to.equal(systemid);
					Code.expect(post.UserId).to.equal(userid);
					done();
				});
			});
			lab.test("should return error if title is undefined", function(done){
				Mely.Administrator.createPost({
					content: content,
					status: published,
					systemid: systemid,
					userid: userid
				},function(err, post){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(post).to.be.undefined();
					done();
				});
			});
			lab.test("should return error if content is undefined", function(done){
				Mely.Administrator.createPost({
					title: title,
					status: published,
					systemid: systemid,
					userid: userid
				},function(err, post){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(post).to.be.undefined();
					done();
				});
			});
			lab.test("should return error if systemid is undefined", function(done){
				Mely.Administrator.createPost({
					title: title,
					content: content,
					status: published,
					userid: userid
				},function(err, post){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(post).to.be.undefined();
					done();
				});
			});
			lab.test("should return error if userid is undefined", function(done){
				Mely.Administrator.createPost({
					title: title,
					content: content,
					status: published,
					systemid: systemid
				},function(err, post){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(post).to.be.undefined();
					done();
				});
			});
			lab.test("should return error if status is undefined", function(done){
				Mely.Administrator.createPost({
					title: title,
					content: content,
					systemid: systemid,
					userid: userid
				},function(err, post){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(post).to.be.undefined();
					done();
				});
			});
		});
		lab.experiment("GetPost()", function(){
			lab.test("should return array w/ post objects", function(done){
				Mely.Administrator.getPost({
					systemid: systemid
				}, function(err, posts){
					Code.expect(err).to.be.null();
					Code.expect(posts).to.not.equal(undefined);
					done();
				});
			});
			lab.test("should return array w/ 1 post object", function(done){
				Mely.Administrator.getPost({
					systemid: systemid,
					id: postid
				}, function(err, posts){
					Code.expect(posts).to.be.an.array();
					Code.expect(err).to.be.null();
					Code.expect(posts).to.not.equal(undefined);
					done();
				});
			});
			lab.test("should return error when systemid is undefined", function(done){
				Mely.Administrator.getPost({
				}, function(err, posts){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(posts).to.be.undefined();
					done();
				});
			});
		});
		lab.experiment("UpdatePost()", function(){
			lab.test("should update post", function(done){
				Mely.Administrator.updatePost({
					id: postid,
					title: title,
					content: content,
					status: published
				}, function(err, post){
					Code.expect(err).to.be.null();
					Code.expect(post).to.not.equal(undefined);
					done();
				});
			});
			lab.test("should return error when postid is undefined", function(done){
				Mely.Administrator.updatePost({
					title: title,
					content: content,
					status: published
				}, function(err, post){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(post).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when title is undefined", function(done){
				Mely.Administrator.updatePost({
					id: postid,
					content: content,
					status: published
				}, function(err, post){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(post).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when content is undefined", function(done){
				Mely.Administrator.updatePost({
					id: postid,
					title: title,
					status: published
				}, function(err, post){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(post).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when status is undefined", function(done){
				Mely.Administrator.updatePost({
					id: postid,
					title: title,
					content: content
				}, function(err, post){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(post).to.be.undefined();
					done();
				});
			});
		});
	});
	lab.experiment("Themes", function(){
		lab.experiment("CreateTheme()", function(){
			lab.test("should return theme object", function(done){
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
					Code.expect(err).to.be.null();
					Code.expect(theme).to.not.equal(undefined);
					done();
				});
			});
			lab.test("should return error when name is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when description is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when systemid is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when headback is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when headfontcolor is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when headfontsize is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when menuback is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when menufontcolor is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when menufontsize is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when posttitlecolor is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when posttitlesize is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when postcontentcolor is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when postcontentsize is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when pagetitlecolor is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when pagetitlesize is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when pagecontentcolor is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when pagecontentsize is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
		});
		lab.experiment("GetTheme()", function(){
			lab.test("should return array w/ theme objects", function(done){
				Mely.Administrator.getTheme({
					systemid: systemid
				}, function(err, themes){
					Code.expect(err).to.be.null();
					Code.expect(themes).to.not.equal(undefined);
					done();
				});
			});
			lab.test("should return array w/ 1 theme object", function(done){
				Mely.Administrator.getTheme({
					systemid: systemid,
					id: themeid
				}, function(err, themes){
					Code.expect(themes).to.be.an.array();
					Code.expect(err).to.be.null();
					Code.expect(themes).to.not.equal(undefined);
					done();
				});
			});
			lab.test("should return error when systemid is undefined", function(done){
				Mely.Administrator.getUser({
				}, function(err, themes){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(themes).to.be.undefined();
					done();
				});
			});
		});
		lab.experiment("GetThemeSetting()", function(){
			lab.test("should return array w/ 1 theme setting object", function(done){
				Mely.Administrator.getThemeSetting({
					id: themeid
				}, function(err, themesetting){
					Code.expect(err).to.be.null();
					Code.expect(themesetting).to.not.equal(undefined);
					done();
				});
			});
			lab.test("should return error when id is undefined", function(done){
				Mely.Administrator.getThemeSetting({
				}, function(err, themesetting){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(themesetting).to.be.undefined();
					done();
				});
			});
		});
		lab.experiment("UpdateTheme()", function(){
			lab.test("should update theme", function(done){
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
					Code.expect(err).to.be.null();
					Code.expect(theme).to.not.equal(undefined);
					done();
				});
			});
			lab.test("should return error when name is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when description is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when id is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when headback is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when headfontcolor is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when headfontsize is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when menuback is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when menufontcolor is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when menufontsize is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when posttitlecolor is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when posttitlesize is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when postcontentcolor is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when postcontentsize is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when pagetitlecolor is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when pagetitlesize is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when pagecontentcolor is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when pagecontentsize is undefined", function(done){
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
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
		});
		lab.experiment("ActivateTheme()", function(){
			lab.test("should activate theme", function(done){
				Mely.Administrator.activateTheme({
					systemid: systemid,
					id: themeid
				}, function(err, theme){
					Code.expect(err).to.be.null();
					Code.expect(theme).to.not.equal(undefined);
					done();
				});
			});
			lab.test("should return error when systemid is undefined", function(done){
				Mely.Administrator.activateTheme({
					id: themeid
				}, function(err, theme){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when id is undefined", function(done){
				Mely.Administrator.activateTheme({
					systemid: systemid
				}, function(err, theme){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(theme).to.be.undefined();
					done();
				});
			});
		});
	});
	lab.experiment("Other Functions", function(){
		lab.experiment("GetThemeFiles()", function(){
			lab.test("should return array of file name objects", function(done){
				Mely.Administrator.getThemeFiles({
				}, function(err, files){
					Code.expect(err).to.be.null();
					Code.expect(files).to.not.equal(undefined);
					done();
				});
			});
		});
	});
	lab.experiment("Comments", function(){
		lab.experiment("CreateComment()", function(){
			lab.test("should return comment object", function(done){
				Mely.Administrator.createComment({
					systemid: systemid,
					email: email,
					content: content,
					postid: postid
				},function(err, comment){
					Code.expect(err).to.be.null();
					Code.expect(comment).to.not.equal(undefined);
					Code.expect(comment.email).to.equal(email);
					Code.expect(comment.content).to.equal(content);
					Code.expect(comment.PostId).to.equal(postid);
					done();
				});
			});
			lab.test("should return error if email is undefined", function(done){
				Mely.Administrator.createComment({
					systemid: systemid,
					content: content,
					postid: postid
				},function(err, comment){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(comment).to.be.undefined();
					done();
				});
			});
			lab.test("should return error if content is undefined", function(done){
				Mely.Administrator.createComment({
					systemid: systemid,
					email: email,
					postid: postid
				},function(err, comment){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(comment).to.be.undefined();
					done();
				});
			});
			lab.test("should return error if postid is undefined", function(done){
				Mely.Administrator.createComment({
					systemid: systemid,
					email: email,
					content: content
				},function(err, comment){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(comment).to.be.undefined();
					done();
				});
			});
			lab.test("should return error if systemid is undefined", function(done){
				Mely.Administrator.createComment({
					email: email,
					content: content,
					postid: postid
				},function(err, comment){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(comment).to.be.undefined();
					done();
				});
			});
		});
		lab.experiment("GetComment()", function(){
			lab.test("should return array w/ ALL comment objects", function(done){
				Mely.Administrator.getComment({
					systemid: systemid
				}, function(err, comments){
					Code.expect(err).to.be.null();
					Code.expect(comments).to.not.equal(undefined);
					done();
				});
			});
			lab.test("should return array w/ approved comment objects ONLY of postid", function(done){
				Mely.Administrator.getComment({
					systemid: systemid,
					postid: postid,
					approved: true
				}, function(err, comments){
					for(var item in comments){
						Code.expect(comments[item].postid).to.equal(postid);
					}
					Code.expect(err).to.be.null();
					Code.expect(comments).to.not.equal(undefined);
					done();
				});
			});
			lab.test("should return error when systemid is undefined", function(done){
				Mely.Administrator.getComment({
				}, function(err, comments){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(comments).to.be.undefined();
					done();
				});
			});
		});
		lab.experiment("ApproveComment()", function(){
			lab.test("should approve comment", function(done){
				Mely.Administrator.approveComment({
					commentid: commentid,
					direction: directionOfApproval
				}, function(err, comment){
					Code.expect(err).to.be.null();
					Code.expect(comment).to.not.equal(undefined);
					done();
				});
			});
			lab.test("should return error when commentid is undefined", function(done){
				Mely.Administrator.approveComment({
					direction: directionOfApproval
				}, function(err, comment){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(comment).to.be.undefined();
					done();
				});
			});
			lab.test("should return error when direction is undefined", function(done){
				Mely.Administrator.approveComment({
					commentid: commentid
				}, function(err, comment){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(comment).to.be.undefined();
					done();
				});
			});
		});
		lab.experiment("UpComment()", function(){
			lab.test("should upvote comment", function(done){
				Mely.Administrator.upComment({
					commentid: commentid,
				}, function(err, comment){
					Code.expect(err).to.be.null();
					Code.expect(comment).to.not.equal(undefined);
					done();
				});
			});
			lab.test("should return error when commentid is undefined", function(done){
				Mely.Administrator.upComment({
				}, function(err, comment){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(comment).to.be.undefined();
					done();
				});
			});
		});
		lab.experiment("DownComment()", function(){
			lab.test("should downvote comment", function(done){
				Mely.Administrator.downComment({
					commentid: commentid,
				}, function(err, comment){
					Code.expect(err).to.be.null();
					Code.expect(comment).to.not.equal(undefined);
					done();
				});
			});
			lab.test("should return error when commentid is undefined", function(done){
				Mely.Administrator.downComment({
				}, function(err, comment){
					Code.expect(err).to.be.an.instanceof(Error);
					Code.expect(comment).to.be.undefined();
					done();
				});
			});
		});
	});
});
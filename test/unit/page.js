var Code = require("code");
var Lab = require("lab");
var lab = exports.lab = Lab.script();
var models = require("../../lib/models");
var Mely = require("../../lib");
var defaults = require("../global");

lab.experiment("Page", function(){
	lab.before(function(done){
		var virt_modules = [];
		models.init(virt_modules, function(){
			Mely.System.createSystem({
				name: defaults.test_blog_name,
				description: defaults.test_blog_descr
			},function(err, system){
				Mely.User.createUser({
					email: defaults.test_email,
					password: defaults.test_password,
					systemid: defaults.system_id
				}, function(err, user){
					done();
				});
			});
		});
	});
	lab.experiment("CreatePage()", function(){
		lab.test("should return page object", function(done){
			Mely.Page.createPage({
				title: defaults.test_title,
				content: defaults.test_content,
				status: defaults.is_published,
				systemid: defaults.system_id,
				userid: defaults.user_id,
				order: defaults.page_order,
				menuview: defaults.is_on_menu
			},function(err, page){
				Code.expect(err).to.be.null();
				Code.expect(page).to.not.equal(undefined);
				Code.expect(page.title).to.equal(defaults.test_title);
				Code.expect(page.content).to.equal(defaults.test_content);
				Code.expect(page.status).to.equal(defaults.is_published);
				Code.expect(page.SystemId).to.equal(defaults.system_id);
				Code.expect(page.UserId).to.equal(defaults.user_id);
				done();
			});
		});
		lab.test("should return error if title is undefined", function(done){
			Mely.Page.createPage({
				content: defaults.test_content,
				status: defaults.is_published,
				systemid: defaults.system_id,
				userid: defaults.user_id,
				order: defaults.page_order,
				menuview: defaults.is_on_menu
			},function(err, page){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(page).to.be.undefined();
				done();
			});
		});
		lab.test("should return error if content is undefined", function(done){
			Mely.Page.createPage({
				title: defaults.test_title,
				status: defaults.is_published,
				systemid: defaults.system_id,
				userid: defaults.user_id,
				order: defaults.page_order,
				menuview: defaults.is_on_menu
			},function(err, page){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(page).to.be.undefined();
				done();
			});
		});
		lab.test("should return error if systemid is undefined", function(done){
			Mely.Page.createPage({
				title: defaults.test_title,
				content: defaults.test_content,
				status: defaults.is_published,
				userid: defaults.user_id,
				order: defaults.page_order,
				menuview: defaults.is_on_menu
			},function(err, page){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(page).to.be.undefined();
				done();
			});
		});
		lab.test("should return error if userid is undefined", function(done){
			Mely.Page.createPage({
				title: defaults.test_title,
				content: defaults.test_content,
				status: defaults.is_published,
				systemid: defaults.system_id,
				order: defaults.page_order,
				menuview: defaults.is_on_menu
			},function(err, page){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(page).to.be.undefined();
				done();
			});
		});
		lab.test("should return error if order is undefined", function(done){
			Mely.Page.createPage({
				title: defaults.test_title,
				content: defaults.test_content,
				systemid: defaults.system_id,
				userid: defaults.user_id,
				order: defaults.page_order,
				menuview: defaults.is_on_menu
			},function(err, page){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(page).to.be.undefined();
				done();
			});
		});
		lab.test("should return error if status is undefined", function(done){
			Mely.Page.createPage({
				title: defaults.test_title,
				content: defaults.test_content,
				systemid: defaults.system_id,
				userid: defaults.user_id,
				order: defaults.page_order,
				menuview: defaults.is_on_menu
			},function(err, page){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(page).to.be.undefined();
				done();
			});
		});
	});
	lab.experiment("GetPage()", function(){
		lab.test("should return array w/ page objects", function(done){
			Mely.Page.getPage({
				systemid: defaults.system_id
			}, function(err, pages){
				Code.expect(err).to.be.null();
				Code.expect(pages).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return array w/ 1 page object if id is present", function(done){
			Mely.Page.getPage({
				systemid: defaults.system_id,
				id: defaults.page_id
			}, function(err, pages){
				Code.expect(pages).to.be.an.array();
				Code.expect(err).to.be.null();
				Code.expect(pages).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return array w/ 1 page object if id is present", function(done){
			Mely.Page.getPage({
				systemid: defaults.system_id,
				id: defaults.page_id,
				status: defaults.is_published
			}, function(err, pages){
				Code.expect(pages).to.be.an.array();
				Code.expect(err).to.be.null();
				Code.expect(pages).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return array w/ 1 page object if title is present", function(done){
			Mely.Page.getPage({
				systemid: defaults.system_id,
				title: defaults.test_title
			}, function(err, pages){
				Code.expect(pages).to.be.an.array();
				Code.expect(err).to.be.null();
				done();
			});
		});
		lab.test("should return error when systemid is undefined", function(done){
			Mely.Page.getPage({
			}, function(err, pages){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(pages).to.be.undefined();
				done();
			});
		});
	});
	lab.experiment("UpdatePage()", function(){
		lab.test("should update page", function(done){
			Mely.Page.updatePage({
				id: defaults.page_id,
				title: defaults.test_title,
				content: defaults.test_content,
				status: defaults.is_published,
				order: defaults.page_order,
				menuview: defaults.is_on_menu
			}, function(err, page){
				Code.expect(err).to.be.null();
				Code.expect(page).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return error when pageid is undefined", function(done){
			Mely.Page.updatePage({
				title: defaults.test_title,
				content: defaults.test_content,
				status: defaults.is_published,
				order: defaults.page_order,
				menuview: defaults.is_on_menu
			}, function(err, page){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(page).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when title is undefined", function(done){
			Mely.Page.updatePage({
				id: defaults.page_id,
				content: defaults.test_content,
				status: defaults.is_published,
				order: defaults.page_order,
				menuview: defaults.is_on_menu
			}, function(err, page){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(page).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when content is undefined", function(done){
			Mely.Page.updatePage({
				id: defaults.page_id,
				title: defaults.test_title,
				status: defaults.is_published,
				order: defaults.page_order,
				menuview: defaults.is_on_menu
			}, function(err, page){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(page).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when status is undefined", function(done){
			Mely.Page.updatePage({
				id: defaults.page_id,
				title: defaults.test_title,
				content: defaults.test_content,
				order: defaults.page_order,
				menuview: defaults.is_on_menu
			}, function(err, page){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(page).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when order is undefined", function(done){
			Mely.Page.updatePage({
				id: defaults.page_id,
				title: defaults.test_title,
				content: defaults.test_content,
				status: defaults.is_published,
				menuview: defaults.is_on_menu
			}, function(err, page){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(page).to.be.undefined();
				done();
			});
		});
	});
	lab.experiment("DeletePage()", function(){
		lab.test("should delete page", function(done){
			Mely.Page.deletePage({
				id: defaults.page_id
			}, function(err, page){
				Code.expect(err).to.be.null();
				Code.expect(page).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should error when id is not passed", function(done){
			Mely.Page.deletePage({
			}, function(err, page){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(page).to.be.undefined();
				done();
			});
		});
	});
});
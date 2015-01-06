var Code = require("code");
var Lab = require("lab");
var lab = exports.lab = Lab.script();
var models = require("../../lib/models");
var Mely = require("../../lib");
var defaults = require("../global");

lab.experiment("Post", function(){
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
	lab.experiment("CreatePost()", function(){
		lab.test("should return post object", function(done){
			Mely.Post.createPost({
				title: defaults.test_title,
				content: defaults.test_content,
				status: defaults.is_published,
				systemid: defaults.system_id,
				userid: defaults.user_id,
				comments: defaults.is_comments
			},function(err, post){
				Code.expect(err).to.be.null();
				Code.expect(post).to.not.equal(undefined);
				Code.expect(post.title).to.equal(defaults.test_title);
				Code.expect(post.content).to.equal(defaults.test_content);
				Code.expect(post.status).to.equal(defaults.is_published);
				Code.expect(post.SystemId).to.equal(defaults.system_id);
				Code.expect(post.UserId).to.equal(defaults.user_id);
				done();
			});
		});
		lab.test("should return error if title is undefined", function(done){
			Mely.Post.createPost({
				content: defaults.test_content,
				status: defaults.is_published,
				systemid: defaults.system_id,
				userid: defaults.user_id
			},function(err, post){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(post).to.be.undefined();
				done();
			});
		});
		lab.test("should return error if content is undefined", function(done){
			Mely.Post.createPost({
				title: defaults.test_title,
				status: defaults.is_published,
				systemid: defaults.system_id,
				userid: defaults.user_id
			},function(err, post){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(post).to.be.undefined();
				done();
			});
		});
		lab.test("should return error if systemid is undefined", function(done){
			Mely.Post.createPost({
				title: defaults.test_title,
				content: defaults.test_content,
				status: defaults.is_published,
				userid: defaults.user_id
			},function(err, post){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(post).to.be.undefined();
				done();
			});
		});
		lab.test("should return error if userid is undefined", function(done){
			Mely.Post.createPost({
				title: defaults.test_title,
				content: defaults.test_content,
				status: defaults.is_published,
				systemid: defaults.system_id
			},function(err, post){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(post).to.be.undefined();
				done();
			});
		});
		lab.test("should return error if status is undefined", function(done){
			Mely.Post.createPost({
				title: defaults.test_title,
				content: defaults.test_content,
				systemid: defaults.system_id,
				userid: defaults.user_id
			},function(err, post){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(post).to.be.undefined();
				done();
			});
		});
	});
	lab.experiment("GetPost()", function(){
		lab.test("should return array w/ post objects", function(done){
			Mely.Post.getPost({
				systemid: defaults.system_id
			}, function(err, posts){
				Code.expect(err).to.be.null();
				Code.expect(posts).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return array w/ 1 post object", function(done){
			Mely.Post.getPost({
				systemid: defaults.system_id,
				id: defaults.post_id
			}, function(err, posts){
				Code.expect(posts).to.be.an.array();
				Code.expect(err).to.be.null();
				Code.expect(posts).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return array w/ 1 post object", function(done){
			Mely.Post.getPost({
				systemid: defaults.system_id,
				id: defaults.post_id,
				status: defaults.is_published
			}, function(err, posts){
				Code.expect(posts).to.be.an.array();
				Code.expect(err).to.be.null();
				Code.expect(posts).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return error when systemid is undefined", function(done){
			Mely.Post.getPost({
			}, function(err, posts){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(posts).to.be.undefined();
				done();
			});
		});
	});
	lab.experiment("UpdatePost()", function(){
		lab.test("should update post", function(done){
			Mely.Post.updatePost({
				id: defaults.post_id,
				title: defaults.test_title,
				content: defaults.test_content,
				status: defaults.is_published,
				comments: defaults.is_comments
			}, function(err, post){
				Code.expect(err).to.be.null();
				Code.expect(post).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return error when postid is undefined", function(done){
			Mely.Post.updatePost({
				title: defaults.test_title,
				content: defaults.test_content,
				status: defaults.is_published
			}, function(err, post){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(post).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when title is undefined", function(done){
			Mely.Post.updatePost({
				id: defaults.post_id,
				content: defaults.test_content,
				status: defaults.is_published
			}, function(err, post){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(post).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when content is undefined", function(done){
			Mely.Post.updatePost({
				id: defaults.post_id,
				title: defaults.test_title,
				status: defaults.is_published
			}, function(err, post){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(post).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when status is undefined", function(done){
			Mely.Post.updatePost({
				id: defaults.post_id,
				title: defaults.test_title,
				content: defaults.test_content
			}, function(err, post){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(post).to.be.undefined();
				done();
			});
		});
	});
	lab.experiment("DeletePost()", function(){
		lab.test("should delete post", function(done){
			Mely.Post.deletePost({
				id: defaults.post_id
			}, function(err, post){
				Code.expect(err).to.be.null();
				Code.expect(post).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should error when id is not passed", function(done){
			Mely.Post.deletePost({
			}, function(err, post){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(post).to.be.undefined();
				done();
			});
		});
	});
});
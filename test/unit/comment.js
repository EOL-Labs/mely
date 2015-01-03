var Code = require("code");
var Lab = require("lab");
var lab = exports.lab = Lab.script();
var models = require("../../lib/models");
var Mely = require("../../lib");
var defaults = require("../global");

lab.experiment("Comment", function(){
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
					Mely.Post.createPost({
						title: defaults.test_title,
						content: defaults.test_content,
						status: defaults.is_live,
						systemid: defaults.system_id,
						userid: defaults.user_id
					},function(err, post){
						done();
					});
				});
			});
		});
	});
	lab.experiment("CreateComment()", function(){
		lab.test("should return comment object", function(done){
			Mely.Comment.createComment({
				systemid: defaults.system_id,
				email: defaults.test_email,
				content: defaults.test_content,
				postid: defaults.post_id
			},function(err, comment){
				Code.expect(err).to.be.null();
				Code.expect(comment).to.not.equal(undefined);
				Code.expect(comment.email).to.equal(defaults.test_email);
				Code.expect(comment.content).to.equal(defaults.test_content);
				Code.expect(comment.PostId).to.equal(defaults.post_id);
				done();
			});
		});
		lab.test("should return error if email is undefined", function(done){
			Mely.Comment.createComment({
				systemid: defaults.system_id,
				content: defaults.test_content,
				postid: defaults.post_id
			},function(err, comment){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(comment).to.be.undefined();
				done();
			});
		});
		lab.test("should return error if content is undefined", function(done){
			Mely.Comment.createComment({
				systemid: defaults.system_id,
				email: defaults.test_email,
				postid: defaults.post_id
			},function(err, comment){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(comment).to.be.undefined();
				done();
			});
		});
		lab.test("should return error if postid is undefined", function(done){
			Mely.Comment.createComment({
				systemid: defaults.system_id,
				email: defaults.test_email,
				content: defaults.test_content
			},function(err, comment){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(comment).to.be.undefined();
				done();
			});
		});
		lab.test("should return error if systemid is undefined", function(done){
			Mely.Comment.createComment({
				email: defaults.test_email,
				content: defaults.test_content,
				postid: defaults.post_id
			},function(err, comment){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(comment).to.be.undefined();
				done();
			});
		});
	});
	lab.experiment("GetComment()", function(){
		lab.test("should return array w/ ALL comment objects", function(done){
			Mely.Comment.getComment({
				systemid: defaults.system_id
			}, function(err, comments){
				Code.expect(err).to.be.null();
				Code.expect(comments).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return array w/ approved comment objects ONLY of postid", function(done){
			Mely.Comment.getComment({
				systemid: defaults.system_id,
				postid: defaults.post_id,
				approved: defaults.is_approved
			}, function(err, comments){
				for(var item in comments){
					Code.expect(comments[item].postid).to.equal(defaults.post_id);
				}
				Code.expect(err).to.be.null();
				Code.expect(comments).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return error when systemid is undefined", function(done){
			Mely.Comment.getComment({
			}, function(err, comments){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(comments).to.be.undefined();
				done();
			});
		});
	});
	lab.experiment("ApproveComment()", function(){
		lab.test("should approve comment", function(done){
			Mely.Comment.approveComment({
				commentid: defaults.comment_id,
				direction: defaults.comment_approval
			}, function(err, comment){
				Code.expect(err).to.be.null();
				Code.expect(comment).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return error when commentid is undefined", function(done){
			Mely.Comment.approveComment({
				direction: defaults.comment_approval
			}, function(err, comment){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(comment).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when direction is undefined", function(done){
			Mely.Comment.approveComment({
				commentid: defaults.comment_id
			}, function(err, comment){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(comment).to.be.undefined();
				done();
			});
		});
	});
	lab.experiment("UpComment()", function(){
		lab.test("should upvote comment", function(done){
			Mely.Comment.upComment({
				commentid: defaults.comment_id,
			}, function(err, comment){
				Code.expect(err).to.be.null();
				Code.expect(comment).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return error when commentid is undefined", function(done){
			Mely.Comment.upComment({
			}, function(err, comment){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(comment).to.be.undefined();
				done();
			});
		});
	});
	lab.experiment("DownComment()", function(){
		lab.test("should downvote comment", function(done){
			Mely.Comment.downComment({
				commentid: defaults.comment_id,
			}, function(err, comment){
				Code.expect(err).to.be.null();
				Code.expect(comment).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return error when commentid is undefined", function(done){
			Mely.Comment.downComment({
			}, function(err, comment){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(comment).to.be.undefined();
				done();
			});
		});
	});
});
var Code = require("code");
var Lab = require("lab");
var lab = exports.lab = Lab.script();
var models = require("../../lib/models");
var Mely = require("../../lib");
var defaults = require("../global");

lab.experiment("User", function(){
	lab.before(function(done){
		var virt_modules = [];
		models.init(virt_modules, function(){
			Mely.System.createSystem({
				name: defaults.test_blog_name,
				description: defaults.test_blog_descr
			},function(err, system){
				done();
			});
		});
	});
	lab.experiment("CreateUser()", function(){
    	lab.test("should return user object", function(done){
    		Mely.User.createUser({
				email: defaults.test_email,
				password: defaults.test_password,
				systemid: defaults.system_id
			}, function(err, user){
				Code.expect(err).to.be.null();
				Code.expect(user).to.not.equal(undefined);
				Code.expect(user.email_address).to.equal(defaults.test_email);
				Code.expect(user.password).to.equal(defaults.test_password);
				Code.expect(user.SystemId).to.equal(defaults.system_id);
				Code.expect(user.status).to.equal(true);
				done();
			});
		});
		lab.test("should return error when email is undefined", function(done){
    		Mely.User.createUser({
				password: defaults.test_password,
				systemid: defaults.system_id
			}, function(err, user){
				Code.expect(user).to.be.undefined();
				Code.expect(err).to.be.an.instanceof(Error);
				done();
			});
		});
		lab.test("should return error when password is undefined", function(done){
    		Mely.User.createUser({
				email: defaults.test_email,
				systemid: defaults.system_id
			}, function(err, user){
				Code.expect(user).to.be.undefined();
				Code.expect(err).to.be.an.instanceof(Error);
				done();
			});
		});
		lab.test("should return error when email is undefined", function(done){
    		Mely.User.createUser({
    			email: defaults.test_email,
				password: defaults.test_password
			}, function(err, user){
				Code.expect(user).to.be.undefined();
				Code.expect(err).to.be.an.instanceof(Error);
				done();
			});
		});
	});
	lab.experiment("GetUser()", function(){
		lab.test("should return array w/ user objects", function(done){
			Mely.User.getUser({
				systemid: defaults.system_id
			}, function(err, users){
				Code.expect(err).to.be.null();
				Code.expect(users).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return array w/ 1 user object", function(done){
			Mely.User.getUser({
				systemid: defaults.system_id,
				userid: defaults.user_id
			}, function(err, users){
				Code.expect(err).to.be.null();
				Code.expect(users).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return error when systemid is undefined", function(done){
			Mely.User.getUser({
			}, function(err, users){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(users).to.be.undefined();
				done();
			});
		});
	});
	lab.experiment("LoginUser()", function(){
		lab.test("should return user object", function(done){
			Mely.User.loginUser({
				email: defaults.test_email,
				password: defaults.test_password
			},function(err, user){
				Code.expect(err).to.be.null();
				Code.expect(user).to.not.equal(undefined);
				Code.expect(user.email_address).to.equal(defaults.test_email);
				done();
			});
		});
		lab.test("should return user === null", function(done){
			Mely.User.loginUser({
				email: defaults.test_email2,
				password: defaults.test_password
			},function(err, user){
				Code.expect(err).to.be.null();
				Code.expect(user).to.be.null();
				done();
			});
		});
		lab.test("should return error when email is undefined", function(done){
			Mely.User.loginUser({
				password: defaults.test_password
			},function(err, user){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(user).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when password is undefined", function(done){
			Mely.User.loginUser({
				email: defaults.test_email
			},function(err, user){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(user).to.be.undefined();
				done();
			});
		});
	});
	lab.experiment("ResetPassword()", function(){
		lab.test("should reset the users password", function(done){
			Mely.User.resetPassword({
				email: defaults.test_email,
				password: defaults.test_password2
			},function(err, user){
				Code.expect(err).to.be.null();
				Code.expect(user).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return error when email is undefined", function(done){
			Mely.User.resetPassword({
				email: defaults.test_email2
			},function(err, user){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(user).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when password is undefined", function(done){
			Mely.User.resetPassword({
				password: defaults.test_password2
			},function(err, user){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(user).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when email is not found", function(done){
			Mely.User.resetPassword({
				email: defaults.test_email3,
				password: defaults.test_password2
			},function(err, user){
				Code.expect(err).to.equal("No Email");
				done();
			});
		});
	});
	lab.experiment("DeleteUser()", function(){
		lab.test("should delete user", function(done){
			Mely.User.deleteUser({
				id: defaults.user_id,
			},function(err, user){
				Code.expect(err).to.be.null();
				Code.expect(user).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return error when id is undefined", function(done){
			Mely.User.deleteUser({
			},function(err, user){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(user).to.be.undefined();
				done();
			});
		});
	});
});
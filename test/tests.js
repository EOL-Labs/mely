var assert = require("assert")
//process.env.NODE_ENV = "test"
var configurationFiles = require("../config")
var models = require('../lib/models')


var administration = require("../lib/administration");
var Mely = {};
Mely.Administrator = administration;


describe("Mely Test", function(){
	before(function(done){
		var virt_modules = [];
		models.init(virt_modules, function() {
			done()
		});
	})
	describe("#users", function(){
		describe("#createUser()", function(){
			it('should return the user object after adding it to the database.', function(done) {
				var email = 'test@test.com';
				var password = 'shdi2389chs98w3jnh';
				var sysID = 9999;
				Mely.Administrator.createUser({
					email: email,
					password: password,
					sysID: sysID
				}, function(err, user){
					assert(err == null);
					assert(user !== undefined);
					assert(user.id !== undefined);
					assert(user.email_address !== undefined && user.email_address === email);
					assert(user.password !== undefined && user.password === password);
					assert(user.SystemId !== undefined && user.SystemId === sysID);
					assert(user.user_status !== undefined && user.user_status === true);
					done();
				})
			})
			it('should error out when email is null value.', function(done) {
				var email = null;
				var password = 'fudges';
				var sysID = 9999;
				Mely.Administrator.createUser({
					email: email,
					password: password,
					sysID: sysID
				}, function(err, user){
					assert(err instanceof Error);
					assert(user === undefined);
					done();
				})
			})
			it('should error out when password is null value.', function(done) {
				var email = "test@test.com";
				var password = null;
				var sysID = 9999;
				Mely.Administrator.createUser({
					email: email,
					password: password,
					sysID: sysID
				}, function(err, user){
					assert(err instanceof Error);
					assert(user === undefined);
					done();
				})
			})
			it('should error out when systemID is null value.', function(done) {
				var email = "test@test.com";
				var password = 'chalks';
				var sysID = null;
				Mely.Administrator.createUser({
					email: email,
					password: password,
					sysID: sysID
				}, function(err, user){
					assert(err instanceof Error);
					assert(user === undefined);
					done();
				})
			})		
		})
		describe("#getUser()",function(){
			it('should return an array of user objects ', function(done) {
				var systemID = 9999;
				Mely.Administrator.getUser({
					sysID: systemID
				}, function(err, users){
					assert(err == null)
					assert(users !== undefined)
					done()
				})
			})
			it('should return an array of users with 1 item ', function(done) {
				var systemID = 9999;
				var userID = 1;
				Mely.Administrator.getUser({
					sysID: systemID,
					userID: userID
				}, function(err, users){
					assert(users.length == 1)
					assert(err == null)
					assert(users !== undefined)
					done()
				})
			})
			it('should return error if systemID is null ', function(done) {
				var systemID = null;
				Mely.Administrator.getUser({
					sysID: systemID
				}, function(err, users){
					assert(err instanceof Error);
					assert(users === undefined);
					done();
				})
			})
		})
		
		describe("#updateUser()",function(){
			it('should update user if userID is given', function(done) {
				var userID = 1
				var email = "stephen.pugliese@outlook.com"
				Mely.Administrator.updateUser({
					userID: userID,
					email: email
				},function(err, user){
					assert(err == null)
					assert(user !== undefined)
					done()
				})
			})
			it('should throw error if no userid is given', function(done) {
				var userID = null
				var email = "stephen.pugliese@outlook.com"
				Mely.Administrator.updateUser({
					userID: userID,
					email: email
				},function(err, user){
					assert(err instanceof Error);
					assert(user === undefined);
					done();
				})
			})
		})
		describe("#deleteUser()",function(){
			it('should delete user if userID is given', function(done) {
				var userID = 1
				Mely.Administrator.deleteUser({
					userID: userID,
				},function(err, user){
					assert(err == null)
					assert(user !== undefined)
					done()
				})
			})
			it('should throw error if no userid is given', function(done) {
				var userID = null
				Mely.Administrator.deleteUser({
					userID: userID,
				},function(err, user){
					assert(err instanceof Error);
					assert(user === undefined);
					done();
				})
			})
		})
	})
})
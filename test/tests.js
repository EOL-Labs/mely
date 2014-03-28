var assert = require("assert")
process.env.NODE_ENV = "test"
var configurationFiles = require("../config")
var models = require('../lib/models')

describe("Mely Test", function(){
	before(function(done){
		
		var virt_modules = [];
		models.init(virt_modules, function() {
			console.log('database setup complete');
			done()
		});
		
	})
	describe("Database Configuration Tests", function(){
		it("should have database hostname", function(){
			assert(configurationFiles.database.config.hostname != undefined)
			assert(configurationFiles.database.config.hostname != null)
			assert(configurationFiles.database.config.hostname != "")
		})
		it("should have database name", function(){
			assert(configurationFiles.database.config.db != undefined)
			assert(configurationFiles.database.config.db != null)
			assert(configurationFiles.database.config.db != "")
		})
		it("should have database username", function(){
			assert(configurationFiles.database.config.username != undefined)
			assert(configurationFiles.database.config.username != null)
			assert(configurationFiles.database.config.username != "")
		})
		it("should have database password", function(){
			assert(configurationFiles.database.config.password != undefined)
			assert(configurationFiles.database.config.password != null)
			assert(configurationFiles.database.config.password != "")
		})
		it("should have database type", function(){
			assert(configurationFiles.database.config.type != undefined)
			assert(configurationFiles.database.config.type != null)
			assert(configurationFiles.database.config.type != "")
		})
		it("should have database port", function(){
			assert(configurationFiles.database.config.port != undefined)
			assert(configurationFiles.database.config.port != null)
			assert(configurationFiles.database.config.port != "")
		})
		it("should have be able to connect to the database", function(){
			
		})
		it("should have be able to create models", function(){
			
		})
	})

	describe("Database Integrity Checks",function(){
		it("should return new user object", function(){
			var email = "test@test.com"
			var password = "8asd3f9a34238fdsdasdasd1231ay213434f9sya34dasdasdfad"
			var status = true
			var systemID = 9999
			models.User.create({
				email_address: email,
				password: password,
				user_status: status,
				SystemId: systemID
			}).success(function(object){
				assert.isNotNull(object, 'new user object is not null');
			})		
		})
	})
})



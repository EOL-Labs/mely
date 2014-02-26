var assert = require("assert")
var configurationFiles = require("../config")


describe("Database Configuration Tests", function(){
	it("should have database name", function(){
		assert(configurationFiles.database.config.db != null)
	})
	it("should have database username", function(){
		assert(configurationFiles.database.config.username != null)
	})
	it("should have database password", function(){
		assert(configurationFiles.database.config.password != null)
	})
	it("should have database type", function(){
		assert(configurationFiles.database.config.type != null)
	})
	it("should have database port", function(){
		assert(configurationFiles.database.config.port != null)
	})
})
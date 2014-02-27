var assert = require("assert")
var configurationFiles = require("../config")
//var mely = require('../')

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
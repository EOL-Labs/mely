var Sequelize = require('sequelize')
var configurationFiles = require("../config")
var internals = {}
var models = require('./models').models;
var mely = internals.mely = function(){
}

mely.prototype.connectDB = function(){
	var sequelize = new Sequelize(configurationFiles.database.config.db, configurationFiles.database.config.username, configurationFiles.database.config.password,{
		host: configurationFiles.database.config.hostname,
		dialect: configurationFiles.database.config.type,
		port: configurationFiles.database.config.port,
		sync: {
			force: true
		}
	})

	sequelize.authenticate().complete(function(err){
		if (!!err){
			console.log('Unable to connect to the database:', err)
		}
		else{
			console.log('Connection has been established successfully.')
		}
	})

	models.forEach(function(model) {
		module.exports[model.name] = sequelize.import(__dirname + '/models/' + model.file)
		console.log(model.name + " successfully loaded!")
	});

	//sync

	//associations
}

module.exports = mely

var Mely = new mely;
Mely.connectDB()
var Sequelize = require('sequelize')
var configurationFiles = require("./config")


//move to another file to make it global functional usage
var connectDB = function(){
	var sequelize = new Sequelize(configurationFiles.database.config.db, configurationFiles.database.config.username, configurationFiles.database.config.password,{
		dialect: configurationFiles.database.config.type,
		port: configurationFiles.database.config.port
	})

	sequelize.authenticate().complete(function(err){
		if (!!err){
			console.log('Unable to connect to the database:', err)
		}
		else{
			console.log('Connection has been established successfully.')
		}
	})
}

//connection to database should happen here
//connectDB()
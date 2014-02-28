var Sequelize = require('sequelize')
var configurationFiles = require("../../config")
var internals = {}

var sequelize = new Sequelize(configurationFiles.database.config.db, configurationFiles.database.config.username, configurationFiles.database.config.password,{
	host: configurationFiles.database.config.hostname,
	dialect: configurationFiles.database.config.type,
	port: configurationFiles.database.config.port,
	logging: false,
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

var models = [
	{
		name: "User",
		file: "user"
	},
	{
	 	name: "Page",
	 	file: "page"
	},
	{
	 	name: "Theme",
	 	file: "theme"
	},
	{
	 	name: "Post",
	 	file: "post"
	}
];

models.forEach(function(model) {
	module.exports[model.name] = sequelize.import(__dirname + '/' + model.file)
	console.log(model.name + " successfully loaded!")
});

//sync
(function(model) {
	//remove the force later so users can drop there own stuff
	model.User.sync({force: true})
	model.Page.sync({force: true})
	model.Theme.sync({force: true})
	model.Post.sync({force: true})
})(module.exports)

//associations
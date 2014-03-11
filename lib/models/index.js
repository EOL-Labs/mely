var Sequelize = require('sequelize')
var configurationFiles = require("../../config")
var internals = {}

var sequelize = new Sequelize(configurationFiles.database.config.db, configurationFiles.database.config.username, configurationFiles.database.config.password,{
	host: configurationFiles.database.config.hostname,
	dialect: configurationFiles.database.config.type,
	port: configurationFiles.database.config.port,
	logging: false
})

sequelize.authenticate().complete(function(err){
	if (!!err){
		console.log('Unable to connect to the database:', err)
	}
})

var models = [
	{
		name: "System",
		file: "system"
	},
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
	 	name: "ThemeSetting",
	 	file: "themesetting"
	},
	{
	 	name: "Post",
	 	file: "post"
	},
	{
	 	name: "Status",
	 	file: "status"
	}
];

models.forEach(function(model) {
	module.exports[model.name] = sequelize.import(__dirname + '/' + model.file)
	//console.log(model.name + " successfully loaded!")
});

//sync + associations
//remove the force later so users can drop there own stuff
(function(model) {

	model.System.hasMany(model.User)
	model.User.belongsTo(model.System)
	
	model.System.hasMany(model.Theme)
	model.Theme.belongsTo(model.System)
	
	model.System.hasMany(model.Post)
	model.Post.belongsTo(model.System)

	model.System.hasMany(model.Page)
	model.Page.belongsTo(model.System)

	model.User.hasMany(model.Post)
	model.Post.belongsTo(model.User)

	model.User.hasMany(model.Page)
	model.Page.belongsTo(model.User)

	model.Status.hasMany(model.Post)
	model.Post.belongsTo(model.Status)

	model.Status.hasMany(model.Page)
	model.Page.belongsTo(model.Status)

	model.Theme.hasMany(model.ThemeSetting)
	model.ThemeSetting.belongsTo(model.Theme)

	syncParams = {
		//force: true
	}
	model.System.sync(syncParams).success(function(){
		model.User.sync(syncParams).success(function(){
			model.Page.sync(syncParams).success(function(){
				model.Theme.sync(syncParams).success(function(){
					model.Post.sync(syncParams).success(function(){
						model.ThemeSetting.sync(syncParams).success(function(){
							model.Status.sync(syncParams).success(function(){
								model.Status.count().success(function(statusCount) {
									if (statusCount == 0){
										model.Status.bulkCreate([
											{status_name: "Published"},
											{status_name: "Draft"},
											{status_name: "Deleted"}
										]).success(function(createdRows) {
											console.log("Status Rows Created")
										})
									}
								})
							}).error(function(error){console.log(error)})
						}).error(function(error){console.log(error)})
					}).error(function(error){console.log(error)})
				}).error(function(error){console.log(error)})
			}).error(function(error){console.log(error)})
		}).error(function(error){console.log(error)})
	}).error(function(error){console.log(error)})

	
})(module.exports)

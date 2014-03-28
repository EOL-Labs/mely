var Sequelize = require('sequelize')
var configurationFiles = require("../../config")
var async = require("async")
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


module.exports.init = function(virt_modules, done) {
    for (var i = 0; i < virt_modules.length; i++) {
        virt_modules[i].loadModels(module.exports);
    }
    (function(model) {
		//associations
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

        //testing config
		var syncParams = {};
		switch (process.env.NODE_ENV) {
			case 'test_travis':
			case 'test':
				syncParams = {
					force: true
				}
				break;
		}

		async.parallel({
			system: function(cb) {
				model.System.sync(syncParams).success(function() {
					cb();
				}).error(function(error) { console.log('Error during System.sync(): ' + error); });
			},
			user: function(cb) {
				model.User.sync(syncParams).success(function() {
					cb();
				}).error(function(error) { console.log('Error during User.sync(): ' + error); });
			},
			page: function(cb) {
				model.Page.sync(syncParams).success(function() {
					cb();
				}).error(function(error) { console.log('Error during Page.sync(): ' + error); });
			},
			post: function(cb) {
				model.Post.sync(syncParams).success(function() {
					cb();
				}).error(function(error) { console.log('Error during Post.sync(): ' + error); });
			},
			theme: function(cb) {
				model.Theme.sync(syncParams).success(function() {
					cb();
				}).error(function(error) { console.log('Error during Theme.sync(): ' + error); });
			},
			themesetting: function(cb) {
				model.ThemeSetting.sync(syncParams).success(function() {
					cb();
				}).error(function(error) { console.log('Error during ThemeSetting.sync(): ' + error); });
			},
			status: function(cb) {
				model.Status.sync(syncParams).success(function() {
					model.Status.count().success(function(statusCount) {
						if (statusCount == 0){
							model.Status.bulkCreate([
								{status_name: "Published"},
								{status_name: "Draft"},
								{status_name: "Deleted"}
							]).success(function(createdRows) {
								cb();
							})
						}
					})
				}).error(function(error) { console.log('Error during Status.sync(): ' + error); });
			}
		}, function (errMelySync, resultMelySync) {

		done();
		});
    })(module.exports);
};

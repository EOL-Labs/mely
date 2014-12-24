var Sequelize = require('sequelize');
var database = require("../../config").database;
var async = require("async");
var sequelize = new Sequelize(database.config.db, database.config.username, database.config.password,{
	host: database.config.hostname,
	dialect: database.config.type,
	port: database.config.port,
	logging: false
});

sequelize.authenticate().complete(function(err){
	if (!!err){
		console.log('Unable to connect to the database:', err);
	}
});

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
		name: "Comment",
		file: "comment"
	}
];

models.forEach(function(model) {
	module.exports[model.name] = sequelize.import(__dirname + '/' + model.file);
});


module.exports.init = function(virt_modules, done) {
    for (var i = 0; i < virt_modules.length; i++) {
        virt_modules[i].loadModels(module.exports);
    }
    (function(model) {
		//associations
		model.System.hasMany(model.User);
		model.User.belongsTo(model.System);
		model.System.hasMany(model.Theme);
		model.Theme.belongsTo(model.System);
		model.System.hasMany(model.Post);
		model.Post.belongsTo(model.System);
		model.System.hasMany(model.Page);
		model.Page.belongsTo(model.System);
		model.System.hasMany(model.Comment);
		model.Comment.belongsTo(model.System);

		model.User.hasMany(model.Post);
		model.Post.belongsTo(model.User);
		model.User.hasMany(model.Page);
		model.Page.belongsTo(model.User);

		model.Theme.hasMany(model.ThemeSetting);
		model.ThemeSetting.belongsTo(model.Theme);

		model.Post.hasMany(model.Comment);
		model.Comment.belongsTo(model.Post);

        //testing config
		var syncParams = {};
		switch (process.env.NODE_ENV) {
			case "test_travis":
			case "test":
				sequelize.sync({
					force: true
				}).then(function(){
					console.log("Database Synced (forced)");
					done();
				}).catch(function(error){
					console.log("Sync Error: + " + error);
				});
				break;
			default:
				sequelize.sync({
					force: false
				}).then(function(){
					console.log("Database Synced");
					done();
				}).catch(function(error){
					console.log("Sync Error: + " + error);
				});
				break;
		}
    })(module.exports);
};
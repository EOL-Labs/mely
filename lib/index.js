var Hapi = require('hapi')
var models = require('./models');
var routes = require('./routes');
var configurationFiles = require("../config")
var internals = {}
var mely = internals.mely = function(){
}

mely.prototype.firstRun = function(){
	models.System.findAndCountAll().success(function(systems) {
		if(systems.count == 0){
			//create server using Hapi
			var server = Hapi.createServer(configurationFiles.server.config.hostname, configurationFiles.server.config.port)
			//set its new routes
			server.route(routes.routes)
			//set its view engine + view containers
			server.views({
				engines: {
					html: 'handlebars'            
				},
				path: './lib/views',
				//partialsPath: './lib/views/partials'
			});
			//start new server
			server.start(function(){
				console.log("Now that your new Mely Server has completed its database setup and server creation you are ready to rock! Go to the provided address to finish your setup!\n\nLink: " + configurationFiles.server.config.hostname + ":" + configurationFiles.server.config.port + "/welcome")
			})
		}
	});
}

module.exports = mely

var Mely = new mely;
Mely.firstRun()
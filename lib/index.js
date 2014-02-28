var Hapi = require('hapi')
var models = require('./models');
var routes = require('./routes');
var configurationFiles = require("../config")
var internals = {}
var mely = internals.mely = function(){
}

mely.prototype.firstTimeUser = function(){
	models.User.findAndCountAll().success(function(result) {
		//console.log(result.rows);
		if(result.count == 0){
			//start the roleout
			//need to create a server and start it and display to user!
			var newMelyServer = Hapi.createServer(configurationFiles.server.config.hostname, configurationFiles.server.config.port)
			newMelyServer.route(routes.routes)
			
			newMelyServer.views({
				engines: {
					html: 'handlebars'            
				},
				path: './lib/views',
				//partialsPath: './lib/views/partials'
			});



			newMelyServer.start()
			console.log("Now go to " + configurationFiles.server.config.hostname + ":" + configurationFiles.server.config.port + "/welcome")
		}
	});
}

module.exports = mely

var Mely = new mely;
Mely.firstTimeUser()

var Hapi = require('hapi')
var models = require('./models');
var routes = require('./routes');
var configurationFiles = require("../config")
var internals = {}
var mely = internals.mely = function(){
}

//create server using Hapi
var server = Hapi.createServer(configurationFiles.server.config.hostname, configurationFiles.server.config.port)
server.pack.require("hapi-auth-cookie", function (err) {
	//server cookie
    server.auth.strategy("session", "cookie", true, {
        password: "dfad8fasjdnf89adf",
        cookie: "mely-cookie",
        redirectTo: "/login",
        isSecure: false,
        ttl: 60 * 60 * 1000
    });
    //set its new routes
	server.route(routes.routes)
	//set its view engine + view containers
	server.views({
		engines: {
			html: 'handlebars'            
		},
		path: './lib/views',
		partialsPath: './lib/views/partials'
	})
	//start new server
	server.start(console.log("Server Started - " + configurationFiles.server.config.hostname + ":" + configurationFiles.server.config.port))
});

mely.prototype.firstRun = function(){
	models.System.findAndCountAll().success(function(systems) {
		if(systems.count == 0){
			console.log("Now that your new Mely Server has completed its database setup and server creation you are ready to rock! Go to the provided address to finish your setup!\n\nLink: " + configurationFiles.server.config.hostname + ":" + configurationFiles.server.config.port + "/welcome")
		}
		else{
			console.log("Mely already setup")
			console.log("Admin Link: " + configurationFiles.server.config.hostname + ":" + configurationFiles.server.config.port + "/admin")
			console.log("Site Link: " + configurationFiles.server.config.hostname + ":" + configurationFiles.server.config.port + "/")
		}
	});
}




module.exports = mely

var Mely = new mely;
Mely.firstRun()
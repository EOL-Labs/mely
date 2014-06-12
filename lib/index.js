var Hapi = require('hapi');
var models = require('./models');
var routes = require('./routes');
var configurationFiles = require("../config");
var Mely = {};
var administration = require("./administration");
Mely.Administrator = administration;
//create server using Hapi
var server = Hapi.createServer(configurationFiles.server.config.hostname, configurationFiles.server.config.port, configurationFiles.server.config.options);
server.pack.require("hapi-auth-cookie", function (err) {
	if(err){
		throw err;
	}
	//server cookie
    server.auth.strategy("session", "cookie", true, {
        password: "dfad8fasjdnf89adf",
        cookie: "mely-cookie",
        redirectTo: "/login",
        isSecure: false,
        ttl: 60 * 60 * 1000
    });
    //set its view engine + view containers
	server.views({
		engines: {
			html: 'handlebars'
		},
		path: './lib/views',
		partialsPath: './lib/views/partials'
	});
    //set its new routes
	server.route(routes.routes);

	var virt_modules = [];
	models.init(virt_modules, function() {
		console.log('database setup complete');
	});
	//start server
	server.start(function(){
		//provide directions
		Mely.Administrator.getSystemCount({
		}, function(err, count){
			if (count === 0){
				console.log("Now that your new Mely Server has completed its database setup and server creation you are ready to rock! Go to the provided address to finish your setup!\n\nLink: " + configurationFiles.server.config.hostname + ":" + configurationFiles.server.config.port + "/welcome");
			}
			else{
				console.log("Mely already setup");
				console.log("Admin Link: " + configurationFiles.server.config.hostname + ":" + configurationFiles.server.config.port + "/admin");
				console.log("Site Link: " + configurationFiles.server.config.hostname + ":" + configurationFiles.server.config.port + "/");
			}
		});
	});
});
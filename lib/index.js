var Hapi = require("hapi");
var Mely_Server = new Hapi.Server();
var server_config = require("../config/server").config;
var models = require("./models");
var routes = require("./routes");
var Mely = require("./administration");
var virt_modules = [];

Mely_Server.connection({
	host: server_config.hostname,
	port: server_config.port
	//tls: tlsoptions
});

Mely_Server.register(require("hapi-auth-cookie"), function(err){
	if(err) throw err;
    Mely_Server.auth.strategy("session", "cookie", true, {
        password: "dfad8fasjdnf89adf",
        cookie: "mely-cookie",
        redirectTo: "/login",
        redirectOnTry: false,
        isSecure: false,
        ttl: 60 * 60 * 1000
    });
});

Mely_Server.views({
	engines: {
		html: require("handlebars"),
	},
	path: "./lib/views",
	partialsPath: "./lib/views/partials"
});

Mely_Server.route(routes.routes);

models.init(virt_modules, function() {
	console.log('database setup complete');
});

Mely_Server.start(function(){
	//provide directions
	Mely.getSystemCount({
	}, function(err, count){
		if (count === 0){
			console.log("Now that your new Mely Server has completed its database setup and server creation you are ready to rock! Go to the provided address to finish your setup!\n\nLink: " + serverConfig.config.hostname + ":" + serverConfig.config.port + "/welcome");
		}
		else{
			console.log("Mely already setup");
			console.log("Admin Link: " + Mely_Server.info.uri + "/admin");
			console.log("Site Link: " + Mely_Server.info.uri + "/");
		}
	});
});
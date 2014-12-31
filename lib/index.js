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

models.init(virt_modules, function(err){
	if(err){
		console.log(err);
	}
	else{
		console.log("Database Check Completed");
		Mely.getSystemCount({
		}, function(err, count){
			Mely_Server.start(function(){
				if (count === 0){
					console.log("First Time User! Go to " + Mely_Server.info.uri + "/welcome");
				}
				else{
					console.log(Mely_Server.info.uri + "/admin - Admin Section");
					console.log(Mely_Server.info.uri + "/ - Blog");
				}
			});
		});
	}
});
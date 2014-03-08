var misc = require("../misc");
var administration = require("../administration");
exports.routes = [
	{ method: "GET", path: "/welcome", config: { handler: misc.welcome, auth: false } },
	{ method: "POST", path: "/setup", config: { handler: misc.setup, auth: false } },
	{ method: "GET", path: "/login", config: { handler: administration.loginView, auth: false } },
	{ method: "POST", path: "/login", config: { handler: administration.login, auth: false } },
	{ method: "GET", path: "/admin", config: { handler: administration.adminView } },
	{
		method: "*",
		path: "/{path*}",
		config: {
			handler: {
				directory: {
					path: "./static/",
					listing: false,
					redirectToSlash:true
				}
			},
			auth: false
		}
		
	}
]
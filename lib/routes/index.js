var misc = require("../misc");
var administration = require("../administration");
exports.routes = [
	{ method: "GET", path: "/welcome", config: { handler: misc.welcome, auth: false } },
	{ method: "POST", path: "/setup", config: { handler: misc.setup, auth: false } },
	{ method: "GET", path: "/login", config: { handler: administration.loginView, auth: false } },
	{ method: "GET", path: "/logout", config: { handler: administration.logout, auth: false } },
	{ method: "POST", path: "/login", config: { handler: administration.login, auth: false } },
	{ method: "GET", path: "/admin", config: { handler: administration.adminView } },
	{ method: "GET", path: "/admin/user", config: { handler: administration.users } },
	{ method: "POST", path: "/admin/user", config: { handler: administration.userCreate } },
	{ method: "GET", path: "/admin/user/new", config: { handler: administration.userNewView } },
	{ method: "GET", path: "/admin/user/{id}", config: { handler: administration.userEditView } },
	{ method: "POST", path: "/admin/user/{id}", config: { handler: administration.userEdit } },
	{ method: "DELETE", path: "/admin/user/{id}", config: { handler: administration.userDelete } },
	{ method: "GET", path: "/admin/page", config: { handler: administration.pages } },
	{ method: "POST", path: "/admin/page", config: { handler: administration.pageCreate } },
	{ method: "GET", path: "/admin/page/new", config: { handler: administration.pageNewView } },
	//{ method: "GET", path: "/admin/page/{id}", config: { handler: administration.userEditView } },
	//{ method: "POST", path: "/admin/page/{id}", config: { handler: administration.userEdit } },
	//{ method: "DELETE", path: "/admin/page/{id}", config: { handler: administration.userDelete } },
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
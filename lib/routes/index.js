var misc = require('../misc');
exports.routes = [
	{ method: "GET", path: "/welcome", handler: misc.welcome },
	{ method: "POST", path: "/setup", handler: misc.setup },
	{
		method: '*',
		path: '/{path*}',
		handler: {
			directory: {
				path: './static/',
				listing: false,
				redirectToSlash:true
			}
		}
	}
]
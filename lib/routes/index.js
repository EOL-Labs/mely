exports.routes = [
	{
		method: "GET",
		path: "/welcome",
		handler: function(request, reply){
			//routing happens here

			reply.view("welcome")
		}
	},
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
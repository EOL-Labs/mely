var fs = require("fs");
exports.templates = {
	email_template: function(){
		return fs.readFileSync("static/ink/index.html", "utf8");
	}
};
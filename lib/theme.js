var models = require("./models");
var glob = require("glob");
var changeCase = require("change-case");
var fs = require("fs");
var internals = {};

internals.createTheme = function(input, callback){
	var errorMessages = [];
	var systemid = input.systemid;
	var name = input.name;
	var description = input.description;
	var headlogo = input.logo;
	var headback = input.headback;
	var headfontcolor = input.headfontcolor;
	var headfontsize = input.headfontsize;
	var menuback = input.menuback;
	var menufontcolor = input.menufontcolor;
	var menufontsize = input.menufontsize;
	var posttitlecolor = input.posttitlecolor;
	var posttitlesize = input.posttitlesize;
	var postcontentcolor = input.postcontentcolor;
	var postcontentsize = input.postcontentsize;
	var pagetitlecolor = input.pagetitlecolor;
	var pagetitlesize = input.pagetitlesize;
	var pagecontentcolor = input.pagecontentcolor;
	var pagecontentsize = input.pagecontentsize;
	if (systemid === undefined){
		errorMessages.push("createTheme() requires login");
		callback(new Error(errorMessages));
	}
	else{
		models.Theme.create({
			name: name,
			description: description,
			status: true,
			active: false,
			SystemId: systemid
		}).then(function(theme){
			var themeid = theme.id;
			models.ThemeSetting.create({
				headerfilename: headlogo,
				header_backgroundcolor: headback,
				header_fontcolor: headfontcolor,
				header_fontsize: headfontsize,
				menu_backgroundcolor: menuback,
				menu_fontcolor: menufontcolor,
				menu_fontsize: menufontsize,
				post_titlefontcolor: posttitlecolor,
				post_titlefontsize: posttitlesize,
				post_contentfontcolor: postcontentcolor,
				post_contentfontsize: postcontentsize,
				page_titlefontcolor: pagetitlecolor,
				page_titlefontsize: pagetitlesize,
				page_contentfontcolor: pagecontentcolor,
				page_contentfontsize: pagecontentsize,
				ThemeId: themeid
			}).then(function(themesetting){
				callback(null, themesetting);
			}).catch(function(error){
				errorMessages.push(error);
				callback(new Error(errorMessages));
			});
		}).catch(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}
};

internals.getTheme = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	var systemid = input.systemid;
	var active = input.active;
	if(systemid === undefined){
		errorMessages.push("getTheme() requires login");
		callback(new Error(errorMessages));
	}
	else{
		var whereClause = {
			where:{
				systemid: systemid,
				status: true
			}
		};
		if (id !== undefined){
			whereClause.where.id = id;
		}
		if (active !== undefined){
			whereClause.where.active = active;
		}
		models.Theme.findAll(whereClause
		).then(function(themes){
			callback(null, themes);
		});
	}
};

internals.getThemeSetting = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	models.ThemeSetting.findAll({
		where:{
			ThemeId: id
		}
	}).then(function(themesettings){
		callback(null, themesettings);
	}).catch(function(error){
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
};

internals.updateTheme = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	var name = input.name;
	var description = input.description;
	var headlogo = input.logo;
	var headback = input.headback;
	var headfontcolor = input.headfontcolor;
	var headfontsize = input.headfontsize;
	var menuback = input.menuback;
	var menufontcolor = input.menufontcolor;
	var menufontsize = input.menufontsize;
	var posttitlecolor = input.posttitlecolor;
	var posttitlesize = input.posttitlesize;
	var postcontentcolor = input.postcontentcolor;
	var postcontentsize = input.postcontentsize;
	var pagetitlecolor = input.pagetitlecolor;
	var pagetitlesize = input.pagetitlesize;
	var pagecontentcolor = input.pagecontentcolor;
	var pagecontentsize = input.pagecontentsize;
	models.Theme.find({
		where:{
			id: id
		}
	}).then(function(theme){
		theme.updateAttributes({
			name: name,
			description: description
		}).then(function(){
			models.ThemeSetting.find({
				where:{
					ThemeId: id
				}
			}).then(function(setting){
				setting.updateAttributes({
					headerfilename: headlogo,
					header_backgroundcolor: headback,
					header_fontcolor: headfontcolor,
					header_fontsize: headfontsize,
					menu_backgroundcolor: menuback,
					menu_fontcolor: menufontcolor,
					menu_fontsize: menufontsize,
					post_titlefontcolor: posttitlecolor,
					post_titlefontsize: posttitlesize,
					post_contentfontcolor: postcontentcolor,
					post_contentfontsize: postcontentsize,
					page_titlefontcolor: pagetitlecolor,
					page_titlefontsize: pagetitlesize,
					page_contentfontcolor: pagecontentcolor,
					page_contentfontsize: pagecontentsize
				}).then(function(themesetting){
					callback(null, themesetting);
				}).catch(function(error){
					errorMessages.push(error);
					callback(new Error(errorMessages));
				});
			});
		}).catch(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}).catch(function(error){
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
};

internals.activateTheme = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	var systemid = input.systemid;
	if (systemid === undefined){
		errorMessages.push("activateTheme() requires login");
		callback(new Error(errorMessages));
	}
	else{
		models.Theme.findAll({
			where:{
				id:{
					ne: id
				},
				SystemId: systemid
			}
		}).then(function(themes){
			themes.forEach(function (theme) {
				theme.updateAttributes({
					active: false
				});
			});
		});
		models.Theme.find({
			where:{
				id: id,
				SystemId: systemid
			}
		}).then(function(theme){
			theme.updateAttributes({
				active: true
			}).then(function(theme){
				callback(null, theme);
			});
		}).catch(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}
};

internals.getThemeFiles = function(input, callback){
	var errorMessages = [];
	var fileList = [];
	glob("lib/views/mely/*.html", {}, function (error, files) {
		for(var file in files){
			var fileObj = {};
			fileObj.name = changeCase.titleCase(files[file].replace("lib/views/mely/","").replace(".html",""));
			fileList.push(fileObj);
		}
		glob("lib/views/partials/*.html", {}, function (error, files) {
			for(var file in files){
				if(files[file].indexOf("blog-") !== -1){
					var fileObj = {};
					fileObj.name = changeCase.titleCase(files[file].replace("lib/views/partials/","").replace(".html",""));
					fileList.push(fileObj);
				}
			}
			callback(null, fileList);
		});
	});
};

internals.getFileContents = function(input, callback){
	var errorMessages = [];
	var file = input.id;
	if(file !== undefined){
		file = file.replace(/ /g,"-");
		glob("lib/views/partials/" + file + ".html", {}, function(error, files){
			if(files.length !== 0){
				fs.readFile(files[0], 'utf8', function (err,data) {
					callback(null, [data,file]);
				});
			}
			else{
				glob("lib/views/mely/" + file + ".html", {}, function(error, files){
					fs.readFile(files[0], 'utf8', function (err,data){
						callback(null, [data,file]);
					});
				});
			}
		});
	}
	else{
		var errorMessages = [];
		errorMessages.push("getFileContents() requires a file");
		callback(new Error(errorMessages));
	}
};

internals.writeFileContents = function(input, callback){
	var errorMessages = [];
	var filename = input.filename;
	var content = input.content;
	if(filename !== undefined){
		filename = filename.replace(" ","-");
			glob("lib/views/partials/" + filename + ".html", {}, function(error, files){
			if(files.length !== 0){
				fs.writeFile("lib/views/partials/" + filename + ".html", content, function(err){
					callback(null, "success");
				});
			}
			else{
				callback(null, "file does not exist");
			}
		});
	}
	else{
		var errorMessages = [];
		errorMessages.push("writeFileContents() requires a file");
		callback(new Error(errorMessages));
	}
};

module.exports = internals;
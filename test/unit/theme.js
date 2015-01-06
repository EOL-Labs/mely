var Code = require("code");
var Lab = require("lab");
var lab = exports.lab = Lab.script();
var models = require("../../lib/models");
var Mely = require("../../lib");
var defaults = require("../global");

lab.experiment("Theme", function(){
	lab.before(function(done){
		var virt_modules = [];
		models.init(virt_modules, function(){
			Mely.System.createSystem({
				name: defaults.test_blog_name,
				description: defaults.test_blog_descr
			},function(err, system){
				done();
			});
		});
	});
	lab.experiment("CreateTheme()", function(){
		lab.test("should return theme object", function(done){
			Mely.Theme.createTheme({
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				systemid: defaults.system_id,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.null();
				Code.expect(theme).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return error when name is undefined", function(done){
			Mely.Theme.createTheme({
				description: defaults.test_theme_description,
				systemid: defaults.system_id,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when description is undefined", function(done){
			Mely.Theme.createTheme({
				name: defaults.test_theme_name,
				systemid: defaults.system_id,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when systemid is undefined", function(done){
			Mely.Theme.createTheme({
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when headback is undefined", function(done){
			Mely.Theme.createTheme({
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				systemid: defaults.system_id,
				logo: defaults.theme_test_logo,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when headfontcolor is undefined", function(done){
			Mely.Theme.createTheme({
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				systemid: defaults.system_id,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when headfontsize is undefined", function(done){
			Mely.Theme.createTheme({
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				systemid: defaults.system_id,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when menuback is undefined", function(done){
			Mely.Theme.createTheme({
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				systemid: defaults.system_id,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when menufontcolor is undefined", function(done){
			Mely.Theme.createTheme({
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				systemid: defaults.system_id,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when menufontsize is undefined", function(done){
			Mely.Theme.createTheme({
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				systemid: defaults.system_id,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when posttitlecolor is undefined", function(done){
			Mely.Theme.createTheme({
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				systemid: defaults.system_id,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when posttitlesize is undefined", function(done){
			Mely.Theme.createTheme({
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				systemid: defaults.system_id,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when postcontentcolor is undefined", function(done){
			Mely.Theme.createTheme({
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				systemid: defaults.system_id,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when postcontentsize is undefined", function(done){
			Mely.Theme.createTheme({
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				systemid: defaults.system_id,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when pagetitlecolor is undefined", function(done){
			Mely.Theme.createTheme({
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				systemid: defaults.system_id,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when pagetitlesize is undefined", function(done){
			Mely.Theme.createTheme({
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				systemid: defaults.system_id,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when pagecontentcolor is undefined", function(done){
			Mely.Theme.createTheme({
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				systemid: defaults.system_id,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when pagecontentsize is undefined", function(done){
			Mely.Theme.createTheme({
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				systemid: defaults.system_id,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
	});
	lab.experiment("GetTheme()", function(){
		lab.test("should return array w/ theme objects", function(done){
			Mely.Theme.getTheme({
				systemid: defaults.system_id
			}, function(err, themes){
				Code.expect(err).to.be.null();
				Code.expect(themes).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return array w/ 1 theme object", function(done){
			Mely.Theme.getTheme({
				systemid: defaults.system_id,
				id: defaults.theme_id,
				active: defaults.is_live
			}, function(err, themes){
				Code.expect(themes).to.be.an.array();
				Code.expect(err).to.be.null();
				Code.expect(themes).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return error when systemid is undefined", function(done){
			Mely.Theme.getTheme({
			}, function(err, themes){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(themes).to.be.undefined();
				done();
			});
		});
	});
	lab.experiment("GetThemeSetting()", function(){
		lab.test("should return array w/ 1 theme setting object", function(done){
			Mely.Theme.getThemeSetting({
				id: defaults.theme_id
			}, function(err, themesetting){
				Code.expect(err).to.be.null();
				Code.expect(themesetting).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return error when id is undefined", function(done){
			Mely.Theme.getThemeSetting({
			}, function(err, themesetting){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(themesetting).to.be.undefined();
				done();
			});
		});
	});
	lab.experiment("UpdateTheme()", function(){
		lab.test("should update theme", function(done){
			Mely.Theme.updateTheme({
				id: defaults.theme_id,
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size
			}, function(err, theme){
				Code.expect(err).to.be.null();
				Code.expect(theme).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return error when name is undefined", function(done){
			Mely.Theme.updateTheme({
				id: defaults.theme_id,
				description: defaults.test_theme_description,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when description is undefined", function(done){
			Mely.Theme.updateTheme({
				id: defaults.theme_id,
				name: defaults.test_theme_name,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when id is undefined", function(done){
			Mely.Theme.updateTheme({
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when headback is undefined", function(done){
			Mely.Theme.updateTheme({
				id: defaults.theme_id,
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				logo: defaults.theme_test_logo,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when headfontcolor is undefined", function(done){
			Mely.Theme.updateTheme({
				id: defaults.theme_id,
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when headfontsize is undefined", function(done){
			Mely.Theme.updateTheme({
				id: defaults.theme_id,
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when menuback is undefined", function(done){
			Mely.Theme.updateTheme({
				id: defaults.theme_id,
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when menufontcolor is undefined", function(done){
			Mely.Theme.updateTheme({
				id: defaults.theme_id,
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when menufontsize is undefined", function(done){
			Mely.Theme.updateTheme({
				id: defaults.theme_id,
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when posttitlecolor is undefined", function(done){
			Mely.Theme.updateTheme({
				id: defaults.theme_id,
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when posttitlesize is undefined", function(done){
			Mely.Theme.updateTheme({
				id: defaults.theme_id,
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when postcontentcolor is undefined", function(done){
			Mely.Theme.updateTheme({
				id: defaults.theme_id,
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when postcontentsize is undefined", function(done){
			Mely.Theme.updateTheme({
				id: defaults.theme_id,
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when pagetitlecolor is undefined", function(done){
			Mely.Theme.updateTheme({
				id: defaults.theme_id,
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when pagetitlesize is undefined", function(done){
			Mely.Theme.updateTheme({
				id: defaults.theme_id,
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when pagecontentcolor is undefined", function(done){
			Mely.Theme.updateTheme({
				id: defaults.theme_id,
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentsize: defaults.theme_font_size,
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when pagecontentsize is undefined", function(done){
			Mely.Theme.updateTheme({
				id: defaults.theme_id,
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when theme id is not correct", function(done){
			Mely.Theme.updateTheme({
				id: defaults.theme_id2,
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.black_hex,
				pagecontentsize: defaults.theme_font_size
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when theme setting is not correct", function(done){
			Mely.Theme.updateTheme({
				id: defaults.theme_id,
				name: defaults.test_theme_name,
				description: defaults.test_theme_description,
				logo: defaults.theme_test_logo,
				headback: defaults.white_hex,
				headfontcolor: defaults.black_hex,
				headfontsize: defaults.theme_font_size,
				menuback: defaults.white_hex,
				menufontcolor: defaults.black_hex,
				menufontsize: defaults.theme_font_size,
				posttitlecolor: defaults.black_hex,
				posttitlesize: defaults.theme_font_size,
				postcontentcolor: defaults.black_hex,
				postcontentsize: defaults.theme_font_size,
				pagetitlecolor: defaults.black_hex,
				pagetitlesize: defaults.theme_font_size,
				pagecontentcolor: defaults.theme_font_size,
				pagecontentsize: defaults.theme_font_size
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
	});
	lab.experiment("ActivateTheme()", function(){
		lab.test("should activate theme", function(done){
			Mely.Theme.activateTheme({
				systemid: defaults.system_id,
				id: defaults.theme_id
			}, function(err, theme){
				Code.expect(err).to.be.null();
				Code.expect(theme).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return error when systemid is undefined", function(done){
			Mely.Theme.activateTheme({
				id: defaults.theme_id
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
		lab.test("should return error when id is undefined", function(done){
			Mely.Theme.activateTheme({
				systemid: defaults.system_id
			}, function(err, theme){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(theme).to.be.undefined();
				done();
			});
		});
	});
	lab.experiment("GetThemeFiles()", function(){
		lab.test("should return array of file name objects", function(done){
			Mely.Theme.getThemeFiles({
			}, function(err, files){
				Code.expect(err).to.be.null();
				Code.expect(files).to.not.equal(undefined);
				done();
			});
		});
	});
	lab.experiment("GetFileContents()", function(){
		lab.test("should return mely file contents", function(done){
			Mely.Theme.getFileContents({
				id: defaults.theme_file2
			}, function(err, file){
				Code.expect(err).to.be.null();
				Code.expect(file).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return partial file contents", function(done){
			Mely.Theme.getFileContents({
				id: defaults.theme_file
			}, function(err, file){
				Code.expect(err).to.be.null();
				Code.expect(file).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return error when file is not provided", function(done){
			Mely.Theme.getFileContents({
			}, function(err, file){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(file).to.be.undefined();
				done();
			});
		});
	});
	lab.experiment("WriteFileContents()", function(){
		lab.test("should return mely file contents", function(done){
			Mely.Theme.writeFileContents({
				filename: defaults.theme_file2
			}, function(err, file){
				Code.expect(err).to.be.null();
				Code.expect(file).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return partial file contents", function(done){
			Mely.Theme.writeFileContents({
				filename: defaults.theme_file
			}, function(err, file){
				Code.expect(err).to.be.null();
				Code.expect(file).to.not.equal(undefined);
				done();
			});
		});
		lab.test("should return error when file is not provided", function(done){
			Mely.Theme.writeFileContents({
			}, function(err, file){
				Code.expect(err).to.be.an.instanceof(Error);
				Code.expect(file).to.be.undefined();
				done();
			});
		});
	});
});
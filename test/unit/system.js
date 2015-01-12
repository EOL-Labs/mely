var Code = require("code");
var Lab = require("lab");
var lab = exports.lab = Lab.script();
var models = require("../../lib/models");
var Mely = require("../../lib");
var defaults = require("../global");

lab.experiment("System", function(){
	lab.before(function(done){
		var virt_modules = [];
		models.init(virt_modules, function(){
			done();
		});
	});
	lab.experiment("CreateSystem()", function(){
		lab.test("CreateSystem() w/ System Name & Description", function(done){
			Mely.System.createSystem({
				name: defaults.test_blog_name,
				description: defaults.test_blog_descr
			},function(err, system){
				Code.expect(err).to.be.null();
				Code.expect(system).to.not.equal(undefined);
				done();
			});
		});
		lab.test("CreateSystem() w/o System Name", function(done){
			Mely.System.createSystem({
				description: defaults.test_blog_descr
			},function(err, system){
				Code.expect(system).to.be.undefined();
				Code.expect(err).to.be.an.instanceof(Error);
				done();
			});
		});
	});
	lab.experiment("GetSystem()", function(){
		lab.test("Get Current System", function(done){
			Mely.System.getSystem({
			},function(err, system){
				Code.expect(err).to.be.null();
				Code.expect(system).to.not.equal(undefined);
				done();
			});
		});
	});
	lab.experiment("GetSystemCount()", function(){
		lab.test("Get Current System Count", function(done){
			Mely.System.getSystemCount({
			},function(err, count){
				Code.expect(err).to.be.null();
				Code.expect(count).to.be.a.number();
				done();
			});
		});
	});	
});
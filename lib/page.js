var models = require("./models");
var internals = {};

internals.createPage = function(input, callback){
	var errorMessages = [];
	var title = input.title;
	var content = input.content;
	var status = input.status;
	var systemid = input.systemid;
	var userid = input.userid;
	var order = input.order;
	var menuview = input.menuview;
	if (systemid === undefined || userid === undefined){
		errorMessages.push("createPage() requires login");
		callback(new Error(errorMessages));
	}
	else{
		models.Page.create({
			title:title,
			content:content,
			SystemId:systemid,
			UserId:userid,
			status:status,
			ordernum:order,
			onmenu: menuview
		}).then(function(page) {
			callback(null, page);
		}).catch(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}
};

internals.getPage = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	var systemid = input.systemid;
	var status = input.status;
	var title = input.title;
	if(systemid === undefined){
		errorMessages.push("getPage() requires login");
		callback(new Error(errorMessages));
	}
	else{
		var whereClause = {
			where:{
				systemid: systemid,
				deleted: false
			},
			order: "status, ordernum"
		};
		if (id !== undefined){
			whereClause.where.id = id;
		}
		if (title !== undefined){
			whereClause.where.title = title;
		}
		if (status !== undefined){
			whereClause.where.status = status;
		}
		models.Page.findAll(whereClause
		).then(function(pages) {
			callback(null, pages);
		});
	}
};

internals.updatePage = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	var title = input.title;
	var content = input.content;
	var status = input.status;
	var order = input.order;
	var menuview = input.menuview;
	models.Page.find({
		where:{
			id:id
		}
	}).then(function(page) {
		page.updateAttributes({
			title: title,
			content: content,
			status: status,
			ordernum: order,
			onmenu: menuview
		}).then(function(page) {
			callback(null,page);
		}).catch(function(error){
			errorMessages.push(error);
			callback(new Error(errorMessages));
		});
	}).catch(function(error){
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
};

internals.deletePage = function(input, callback){
	var errorMessages = [];
	var id = input.id;
	models.Page.find({
		where:{
			id:id
		}
	}).then(function(page) {
		page.updateAttributes({
			deleted: 1
		}).then(function(page) {
			callback(null,page);
		});
	}).catch(function(error){
		errorMessages.push(error);
		callback(new Error(errorMessages));
	});
};

module.exports = internals;
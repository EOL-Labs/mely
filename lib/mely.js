var internals = {}
var models = require('./models')
var moment = require('moment')
var marked = require('marked')
var async = require('async')

internals.home = function(request, reply) {
	models.System.find({
		where: {
			system_status: true
		}
	}).success(function(system){
		var systemID = system["id"]
		var systemName = system["system_name"]
		var systemTag = system["system_description"]
		async.parallel([
			//posts
			function(callback){
				models.Post.findAll({
					where:{
						SystemId: systemID,
						StatuID: 1
					},
				 	order: "id DESC"
				 }).success(function(posts){
					var Posts = []
					for (var post in posts) {
						var postRecord = {}
						postRecord.postID = posts[post]["id"]
						postRecord.postTitle = posts[post]["post_title"]
						postRecord.postContent = marked(posts[post]["post_content"])
						postRecord.postLastDate = moment(posts[post]["updatedAt"]).format('MMMM Do YYYY, h:mm:ss a')
						Posts.push(postRecord)
					}
					var MelyPosts = {
						MelyPosts: Posts
					}
					callback(null, MelyPosts)
				}).error(function(error){
					callback(error, null)
				})
			},
			//pages
			function(callback){
				models.Page.findAll({
					where:{
						SystemId: systemID,
						StatuID: 1
					},
					order: "id DESC"
				}).success(function(pages){
					var Pages = []
					for(var page in pages){
						var pageRecord = {}
						pageRecord.pageID = pages[page]["id"]
						pageRecord.pageTitle = pages[page]["page_title"]
						pageRecord.pageContent = pages[page]["page_content"]
						Pages.push(pageRecord)
					}
					var MelyPages = {
						MelyPages: Pages
					}
					callback(null, MelyPages)
				}).error(function(error){
					callback(error, null)	
				})
			},
			//themes
			function(callback){
				models.Theme.find({
					where:{
						SystemId: systemID,
						theme_active: true
					}
				}).success(function(theme){
					if (theme != null){
						var themeID = theme.id
						models.ThemeSetting.find({
							where:{
								ThemeId: themeID
							}
						}).success(function(themesetting){
							var themeRecord = {}
							themeRecord.themeLogo = themesetting["header_logo"]
							themeRecord.themeHeaderBackground = themesetting["header_backgroundcolor"]
							themeRecord.themeHeaderFontColor = themesetting["header_fontcolor"]
							themeRecord.themeHeaderFontSize = themesetting["header_fontsize"]
							themeRecord.themeMenuBackground = themesetting["menu_backgroundcolor"]
							themeRecord.themeMenuFontColor = themesetting["menu_fontcolor"]
							themeRecord.themeMenuFontSize = themesetting["menu_fontsize"]
							themeRecord.themePostTitleFontColor = themesetting["post_titlefontcolor"]
							themeRecord.themePostTitleFontSize = themesetting["post_titlefontsize"]
							themeRecord.themePostContentFontColor = themesetting["post_contentfontcolor"]
							themeRecord.themePostContentFontSize = themesetting["post_contentfontsize"]
							themeRecord.themePageTitleFontColor = themesetting["page_titlefontcolor"]
							themeRecord.themePageTitleFontSize = themesetting["page_titlefontsize"]
							themeRecord.themePageContentFontColor = themesetting["page_contentfontcolor"]
							themeRecord.themePageContentFontSize = themesetting["page_contentfontsize"]
							var MelyTheme = {
								MelyTheme: themeRecord
							}
							callback(null, MelyTheme)
						}).error(function(error){
							callback(error, null)
						})
					}
					else{
						callback(null, {})
					}
				}).error(function(error){
					callback(error, null)
				})
			}
		],
		function(err, results){
			//for(var result in results){
			//	if(results[result].hasOwnProperty("MelyPosts")){
			//		console.log("Has Some Posts")
			//	}
			//	if(results[result].hasOwnProperty("MelyPages")){
			//		console.log("Has Some Pages")
			//	}
			//	if(results[result].hasOwnProperty("MelyTheme")){
			//		console.log("Has an Active Theme")
			//	}
			//}
			var pageDetails = {
				title: "Mely",
				pageContent: results,
				system:{
					title: systemName,
					tag: systemTag
				}
			}
			reply.view("mely/index", pageDetails)
		});
	})
}

exports.home = internals.home
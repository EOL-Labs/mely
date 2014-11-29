app.service("styles", function(){
	var theme;
	$.ajax({
		url: "/api/theme",
		async: false,
		success: function(result){
			theme = result;
		}
	});	
	this.getHeaderClass = function() {
		return {
			background: "#" + theme.themeHeaderBackground,
			color: "#" + theme.themeHeaderFontColor,
			"font-size": theme.themeHeaderFontSize,
		}
	}
	this.getMenuClass = function() {
		return {
			background: "#" + theme.themeMenuBackground,
			color: "#" + theme.themeMenuFontColor,
			"font-size": theme.themeMenuFontSize,
		}
	}
	this.getPageTitleClass = function() {
		return {
			color: "#" + theme.themePageTitleFontColor,
			"font-size": theme.themePageTitleFontSize,
		}
	}
	this.getPageContentClass = function() {
		return {
			color: "#" + theme.themePageContentFontColor,
			"font-size": theme.themePageContentFontSize,
		}
	}
	this.getPostTitleClass = function() {
		return {
			color: "#" + theme.themePostTitleFontColor,
			"font-size": theme.themePostTitleFontSize,
		}
	}
	this.getPostContentClass = function() {
		return {
			color: "#" + theme.themePostContentFontColor,
			"font-size": theme.themePostContentFontSize,
		}
	}
});
//themeLogo: "Austria.png",
$(document).ready(function(){
	(function ($, undefined) {
		$.fn.getCursorPosition = function() {
			var el = $(this).get(0);
			var pos = 0;
			if('selectionStart' in el) {
				pos = el.selectionStart;
			} else if('selection' in document) {
				el.focus();
				var Sel = document.selection.createRange();
				var SelLength = document.selection.createRange().text.length;
				Sel.moveStart('character', -el.value.length);
				pos = Sel.text.length - SelLength;
			}
			return pos;
		};
	})(jQuery);
	$("#H1").click(function(){
		$("#content").surroundSelectedText("# ", "");
	});
	$("#H2").click(function(){
		$("#content").surroundSelectedText("## ", "");
	});
	$("#H3").click(function(){
		$("#content").surroundSelectedText("### ", "");
	});
	$("#H4").click(function(){
		$("#content").surroundSelectedText("#### ", "");
	});
	$("#B").click(function(){
		$("#content").surroundSelectedText("**", "**");
	});
	$("#I").click(function(){
		$("#content").surroundSelectedText("*", "*");
	});
	$("#Strike").click(function(){
		$("#content").surroundSelectedText("~~", "~~");
	});
	$("#BQ").click(function(){
		$("#content").surroundSelectedText("> ", "");
	});
	$("#CD").click(function(){
		$("#content").surroundSelectedText("```", "```");
	});
	$("#HR").click(function(){
		var position = $("#content").getCursorPosition();
		$("#content").insertText("---", position, "collapseToEnd");
	});
	$("#IMG").click(function(){
		$("#imgModal").foundation("reveal", "open");
		$("#image-link").val("");
		$("#image-alternative").val("");
		$("#image-hover").val("");
	});
	$("#LINK").click(function(){
		$("#aModal").foundation("reveal", "open");
		$("#link").val("");
		$("#link-text").val("");
		$("#link-hover").val("");
	});
	$("#preview").click(function(){
		var content = $("#content").val();
		$.ajax({
			url: "/admin/markdown",
			type: "POST",
			data: {
				content: content
			},
			success: function(data){
				//console.log("done")
				$("#preview-panel").removeClass("hide");
				if(data !== ""){
					$("#preview-markdown").html(data);
				}
				else{
					$("#preview-markdown").html("Nothing entered in content");
				}
			}
		});
	});
});

function addImageMarkdown(){
	var whereToAddIt = $("#content").getCursorPosition();
	var image_link = $("#image-link").val();
	var image_alternative = $("#image-alternative").val();
	var image_hover = $("#image-hover").val();
	if(image_link == "" || image_alternative == "" || image_hover == ""){
		alert("All fields are required");
	}
	else{
		$("#content").insertText("![" + image_alternative + "](" + image_link + " '" + image_hover + "')", whereToAddIt, "collapseToEnd");
		$("#imgModal").foundation("reveal", "close");
	}
}
function addLinkMarkdown(){
	var whereToAddIt = $("#content").getCursorPosition();
	var link = $("#link").val();
	var link_text = $("#link-text").val();
	var link_hover = $("#link-hover").val();
	if(link == "" || link_text == "" || link_hover == ""){
		alert("All fields are required");
	}
	else{
		$("#content").insertText("[" + link_text + "](" + link + " '" + link_hover + "')", whereToAddIt, "collapseToEnd");
		$("#aModal").foundation("reveal", "close");
	}
}
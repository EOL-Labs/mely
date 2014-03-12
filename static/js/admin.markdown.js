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
	    }
	})(jQuery);

	$("#H1").click(function(){
		$("#content").surroundSelectedText("# ", "");
	})
	$("#H2").click(function(){
		$("#content").surroundSelectedText("## ", "");
	})
	$("#H3").click(function(){
		$("#content").surroundSelectedText("### ", "");
	})
	$("#H4").click(function(){
		$("#content").surroundSelectedText("#### ", "");
	})
	$("#B").click(function(){
		$("#content").surroundSelectedText("**", "**");
	})
	$("#I").click(function(){
		$("#content").surroundSelectedText("*", "*");
	})
	$("#Strike").click(function(){
		$("#content").surroundSelectedText("~~", "~~");
	})
	$("#BQ").click(function(){
		$("#content").surroundSelectedText("> ", "");
	})
	$("#CD").click(function(){
		$("#content").surroundSelectedText("```", "```");
	})
	$("#HR").click(function(){
		var position = $("#content").getCursorPosition();
		$("#content").insertText("---", position, "collapseToEnd");
	})
	$("#IMG").click(function(){
		var position = $("#content").getCursorPosition();
		var link = prompt("Place Your Link in the Textbox")
		if (link != ""){
			var altText = prompt("Place enter alternate text")
			var hoverText = prompt("Place enter hover text")
			$("#content").insertText("![" + altText + "](" + link + " '" + hoverText + "')", position, "collapseToEnd");
		}
		else{
			alert("Link can not be blank")
		}	
	})
	$("#LINK").click(function(){
		var position = $("#content").getCursorPosition();
		var link = prompt("Your Link")
		if (link != ""){
			var text = prompt("Text for Link")
			if (text != ""){
				var hoverText = prompt("Place enter hover text")
				$("#content").insertText("[" + text + "](" + link + " '" + hoverText + "')", position, "collapseToEnd");
			}
			else{
				alert("Text for Link can not be blank")
			}
		}
		else{
			alert("Link can not be blank")
		}	
	})
	$("#preview").click(function(){
		var content = $("#content").val()
		
		$.ajax({
			url: "/admin/markdown",
			type: "POST",
			data: {
				content: content
			},
			success: function(data){
				//console.log("done")
				$("#preview-panel").removeClass("hide")
				if(data != ""){
					$("#preview-markdown").html(data)
				}
				else{
					$("#preview-markdown").html("Nothing entered in content")
				}
			}
		})
	})
})
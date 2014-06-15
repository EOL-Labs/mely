$(document).ready(function(){
	$("a.files").click(function(){
		var file = encodeURIComponent($(this).attr("id"));
		$.ajax({
			url: "/admin/file/" + file.toLowerCase(),
			type: "GET",
			success: function(data){
				$("#filecontent").val(data[0]);
				$("#filename").val(data[1]);
			}
		});
	});
	$("a#save").click(function(){
		var filename = $("#filename").val();
		var content = $("#filecontent").val();
		$.ajax({
			url: "/admin/file/save",
			type: "POST",
			data:{
				filename: filename,
				content: content
			},
			success: function(data){
				console.log(data);
			}
		});
	});
});
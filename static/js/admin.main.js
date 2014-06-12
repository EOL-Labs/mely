$(document).ready(function(){
	$("a.files").click(function(){
		var file = encodeURIComponent($(this).attr("id"));
		$.ajax({
			url: "/admin/file/" + file.toLowerCase(),
			type: "GET",
			success: function(data){
				$("#filecontent").val(data[0]);
				$("#file").val(data[1]);
			}
		});
	});
});
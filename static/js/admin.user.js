$(document).ready(function(){
	$("a.delete").click(function(){
		var id = $(this).attr("id")
		$.ajax({
			url: "/admin/user/" + id,
			type: "DELETE",
			success: function(){
				$("#user-" + id).remove();
			}
		})
	})
})
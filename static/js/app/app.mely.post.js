app.controller("PostCtrl", function($scope, $http){
	$http.get("/admin/post").success(function(data){
		$scope.posts = data;
	});
	$("#PostModal").on("hide.bs.modal", function() {
		$("#PostForm").data("bootstrapValidator").resetForm(true);
		$("#postid").val("");
	});
	$scope.getPost = function(id){
		$("#PostModal").modal("show");
		$http.get("/admin/post/" + id).success(function(data){
			$("#posttitle").val(data.title);
			$(".postcontent").val(data.content);
			$("#postid").val(data.postid);
			$("#poststatus").val(data.status);
			$("#postcomments").val(data.comments_allowed);
		});
	};
	$scope.process = function(){
		$("#PostForm").data("bootstrapValidator").validate();
		var form = $("#PostForm").data("bootstrapValidator").isValid();
		if(form){
			if($("#postid").val()){
				$http.put("/admin/post", {
					"mely-postid": $("#postid").val(),
					"mely-post-title": $("#posttitle").val(),
					"mely-post-content": $(".postcontent").val(),
					"mely-post-status": $("#poststatus").val(),
					"mely-post-comments": $("#postcomments").val()
				}).success(function(){
					$http.get("/admin/post").success(function(data){
						$scope.posts = data;
						$("#PostModal").modal("hide");
					});
				});
			}
			else{
				$http.post("/admin/post",{
					"mely-post-title": $("#posttitle").val(),
					"mely-post-content": $(".postcontent").val(),
					"mely-post-status": $("#poststatus").val(),
					"mely-post-comments": $("#postcomments").val()
				}).success(function(){
					$http.get("/admin/post").success(function(data){
						$scope.posts = data;
						$("#PostModal").modal("hide");
					});
				});
			}
		}
	};
	$scope.delete = function(postid){
		$http.delete("/admin/post/" + postid).success(function(){	
			var posts = _.filter($scope.posts, function(obj){
				return obj.postId !== postid;
			});
			$scope.posts = posts;
		});
	};
});
app.controller("BlogSinglePost", function($scope, $http, $location){
	var linkArray = $location.absUrl().split("/");
	$http.get("/api/post/" + linkArray[4],{
	}).success(function(data){
		$scope.posts = data;
	}).error(function(data){
		console.log("Error on Post API");
	});
	$http.get("/api/comment/" + linkArray[4],{
	}).success(function(data){
		$scope.comments = data;
		$("#CommentForm").bootstrapValidator({
			feedbackIcons:{
				valid: "glyphicon glyphicon-ok",
				invalid: "glyphicon glyphicon-remove",
				validating: "glyphicon glyphicon-refresh"
			},
			fields:{
				email:{
					validators:{
						notEmpty:{
							message: "Email Address is required"
						},
						emailAddress:{
	                        message: 'The input is not a valid email address'
	                    }
					}
				},
				content:{
					validators:{
						notEmpty:{
							message: "Content is required"
						}
					}
				}
			}
		});
	}).error(function(data){
		console.log("Error on Comment API");
	});
	$http.get("/api/menu",{
	}).success(function(data){
		$scope.menu = data;
	}).error(function(data){
		console.log("Error on Menu API");
	});
	$scope.up = function(commentid){
		$http.get("/comment/" + commentid + "/up",{
		}).success(function(data){
			$http.get("/api/comment/" + linkArray[4],{
			}).success(function(data){
				$scope.comments = data;
			}).error(function(data){
				console.log("Error on Comment API");
			});
		}).error(function(data){
			console.log("Error on Up Vote API");
		});
	};
	$scope.down = function(commentid){
		$http.get("/comment/" + commentid + "/down",{
		}).success(function(data){
			$http.get("/api/comment/" + linkArray[4],{
			}).success(function(data){
				$scope.comments = data;
			}).error(function(data){
				console.log("Error on Comment API");
			});
		}).error(function(data){
			console.log("Error on Up Vote API");
		});
	};
	$scope.share = function(postid, commentid){
		location.href = "/post/" + postid + "#comment-" + commentid;
	}
	$scope.try = function(){
		$("#CommentForm").data("bootstrapValidator").validate();
	}
});
	

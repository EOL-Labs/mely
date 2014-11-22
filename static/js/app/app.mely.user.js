app.controller("UserCtrl", function($scope, $http){
	$http.get("/admin/user").success(function(data){
		$scope.users = data;
	});
	$scope.delete = function(userid){
		$http.delete("/admin/user/" + userid).success(function(){	
			var users = _.filter($scope.users, function(obj){
				return obj.userid !== userid;
			});
			$scope.users = users;
		});
	};
	$scope.process = function(){
		$("#UserForm").data("bootstrapValidator").validate();
		var form = $("#UserForm").data("bootstrapValidator").isValid();
		if(form){
			$http.post("/admin/user",{
				"mely-email": $("#useremail").val(),
				"mely-password": $("#userpassword").val()
			}).success(function(){
				$("#UserForm").data("bootstrapValidator").resetForm(true);
				$("#UserModal").modal("hide");
				$http.get("/admin/user").success(function(data){
					$scope.users = data;
				});
			});
		}
	};
	$("#UserModal").on("hide.bs.modal", function() {
		$("#UserForm").data("bootstrapValidator").resetForm(true);
	});
});
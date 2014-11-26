app.controller("BlogMain", function($scope, $http){
	$http.get("/api/post",{
	}).success(function(data){
		for(var item in data){
			$.ajax({
				url: "/api/author/" + data[item].userid, 
				async: false,
				success: function(result) {
					data[item].author = result;
				}
			});
		}
		$scope.posts = data;

	}).error(function(data){
		console.log("Error on Post API");
	});
	$http.get("/api/menu",{
	}).success(function(data){
		$scope.menu = data;
	}).error(function(data){
		console.log("Error on Post API");
	});
	$scope.$on("ngRepeatFinished", function(ngRepeatFinishedEvent){
		window.scrollSuperReveal = new scrollReveal({
			reset: false
		});
	});
});
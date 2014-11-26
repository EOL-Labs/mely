app.controller("BlogMain", function($scope, $http){
	$http.get("/api/post",{
	}).success(function(data){
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
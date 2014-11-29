app.controller("BlogPage", function($scope, $http, $location, styles){
	$scope.headerStyle = styles.getHeaderClass();
	$scope.menuStyle = styles.getMenuClass();
	$scope.pageTitleStyle = styles.getPageTitleClass();
	$scope.pageContentStyle = styles.getPageContentClass();
	var linkArray = $location.absUrl().split("/");
	$http.get("/api/page/" + linkArray[3],{
	}).success(function(data){
		$scope.page = data;
	}).error(function(data){
		console.log("Error on Post API");
	});
	$http.get("/api/menu",{
	}).success(function(data){
		$scope.menu = data;
	}).error(function(data){
		console.log("Error on Post API");
	});
});
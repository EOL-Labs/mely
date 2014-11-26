var app = angular.module("Mely", ["ngSanitize","fox.scrollReveal"]);
app.directive("onFinishRender", ["$timeout",function ($timeout){
	return {
		restrict: "AE",
		link: function (scope, element, attr) {
			if (scope.$last === true) {
				$timeout(function () {
					scope.$emit("ngRepeatFinished");
				});
			}
		}
	}
}]);
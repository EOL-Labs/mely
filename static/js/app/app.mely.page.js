app.controller("PageCtrl", function($scope, $http){
	$http.get("/admin/page").success(function(data){
		$scope.pages = data;
	});
	$("#PageModal").on("hide.bs.modal", function() {
		$("#PageForm").data("bootstrapValidator").resetForm(true);
		$("#pageid").val("");
	});
	$scope.getPage = function(id){
		$("#PageModal").modal("show");
		$http.get("/admin/page/" + id).success(function(data){
			$("#pageid").val(data.pageid);
			$("#pagetitle").val(data.title);
			$(".pagecontent").val(data.content);
			$("#pagestatus").val(data.status);
			$("#pageorder").val(data.order);
			$("#pageview").val(data.onmenu);
		});
	};
	$scope.process = function(){
		$("#PageForm").data("bootstrapValidator").validate();
		var form = $("#PageForm").data("bootstrapValidator").isValid();
		if(form){
			if($("#pageid").val()){
				$http.put("/admin/page", {
					"mely-pageid": $("#pageid").val(),
					"mely-page-title": $("#pagetitle").val(),
					"mely-page-content": $(".pagecontent").val(),
					"mely-page-status": $("#pagestatus").val(),
					"page-order": $("#pageorder").val(),
					"mely-page-menuview": $("#pageview").val()
				}).success(function(){
					$http.get("/admin/page").success(function(data){
						$scope.pages = data;
						$("#PageModal").modal("hide");
					});
				});
			}
			else{
				$http.post("/admin/page",{
					"mely-page-title": $("#pagetitle").val(),
					"mely-page-content": $(".pagecontent").val(),
					"mely-page-status": $("#pagestatus").val(),
					"page-order": $("#pageorder").val(),
					"mely-page-menuview": $("#pageview").val()
				}).success(function(){
					$http.get("/admin/page").success(function(data){
						$scope.pages = data;
						$("#PageModal").modal("hide");
					});
				});
			}
		}
	};
	$scope.delete = function(pageid){
		$http.delete("/admin/page/" + pageid).success(function(){	
			var pages = _.filter($scope.pages, function(obj){
				return obj.pageId !== pageid;
			});
			$scope.pages = pages;
		});
	};
});
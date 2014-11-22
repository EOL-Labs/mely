app.controller("ThemeCtrl", function($scope, $http){
	$http.get("/admin/theme").success(function(data){
		$scope.themes = data;
	});
	$http.get("/admin/file").success(function(data){
		$scope.files = data;
	});
	$scope.getThemeFile = function(name){
		$http.get("/admin/file/" + name.toLowerCase()).success(function(data){
			$scope.themefilename = name;
			$scope.themefile = data[0];
		});
	};
	$scope.saveFile = function(){
		$http.post("/admin/file/save",{
			filename: $scope.themefilename,
			content: $scope.themefile
		}).success(function(data){
			console.log(data);
		});
	};
	$scope.activateTheme = function(id){
		$http.get("/admin/theme/activate/" + id).success(function(data){
			$http.get("/admin/theme").success(function(data){
				$scope.themes = data;
			});
		});
	};
	$("#ThemeModal").on("hide.bs.modal", function() {
		$("#ThemeForm").data("bootstrapValidator").resetForm(true);
		$("#themeid").val("");
	});
	$scope.getTheme = function(id){
		$("#ThemeModal").modal("show");
		$http.get("/admin/theme/" + id).success(function(data){
			$("#themeid").val(data.themeID);
			$("#themename").val(data.name);
			$("#themedescription").val(data.description);
			$("#headerbackcolor").val(data.headbackcolor);
			$("#headerfontcolor").val(data.headfontcolor);
			$("#headerfontsize").val(data.headfontsize);
			$("#menubackcolor").val(data.menubackcolor);
			$("#menufontcolor").val(data.menufontcolor);
			$("#menufontsize").val(data.menufontsize);
			$("#posttitlecolor").val(data.posttitlecolor);
			$("#posttitlefontsize").val(data.posttitlefontsize);
			$("#postcontentcolor").val(data.postcontentcolor);
			$("#postcontentfontsize").val(data.postcontentfontsize);
			$("#pagetitlecolor").val(data.pagetitlecolor);
			$("#pagetitlefontsize").val(data.pagetitlefontsize);
			$("#pagecontentcolor").val(data.pagecontentcolor);
			$("#pagecontentfontsize").val(data.pagecontentfontsize);
			if(data.headerimage !== null){
				$("#image").attr("src", "/img/" + data.headerimage);
				$("#image").removeClass("hide");
			}
			else{
				$("#image").attr("src", "#");
				$("#image").addClass("hide");
			}
		});
	};
	$scope.process = function(){
		$("#ThemeForm").data("bootstrapValidator").validate();
		var form = $("#ThemeForm").data("bootstrapValidator").isValid();
		if(form){
			if($("#themeid").val()){
				var data = new FormData();
				jQuery.each($("#headerimage")[0].files, function(i, file){
					data.append("headerimage", file);
				});
				data.append("id", $("#themeid").val());
				data.append("themename", $("#themename").val());
				data.append("themedescription", $("#themedescription").val());
				data.append("headerbackcolor", $("#headerbackcolor").val());
				data.append("headerfontcolor", $("#headerfontcolor").val());
				data.append("headerfontsize", $("#headerfontsize").val());
				data.append("menubackcolor", $("#menubackcolor").val());
				data.append("menufontcolor", $("#menufontcolor").val());
				data.append("menufontsize", $("#menufontsize").val());
				data.append("posttitlecolor", $("#posttitlecolor").val());
				data.append("posttitlefontsize", $("#posttitlefontsize").val());
				data.append("postcontentcolor", $("#postcontentcolor").val());
				data.append("postcontentfontsize", $("#postcontentfontsize").val());
				data.append("pagetitlecolor", $("#pagetitlecolor").val());
				data.append("pagetitlefontsize", $("#pagetitlefontsize").val());
				data.append("pagecontentcolor", $("#pagecontentcolor").val());
				data.append("pagecontentfontsize", $("#pagecontentfontsize").val());
				$.ajax({
					url: "/admin/theme",
					data: data,
					cache: false,
					contentType: false,
					async: false,
					processData: false,
					type: "PUT",
					success: function(data){
						$http.get("/admin/theme").success(function(data){
							$scope.themes = data;
							$("#ThemeModal").modal("hide");
						});
					}
				});
			}
			else{
				var data = new FormData();
				jQuery.each($("#headerimage")[0].files, function(i, file){
					data.append("headerimage", file);
				});
				data.append("themename", $("#themename").val());
				data.append("themedescription", $("#themedescription").val());
				data.append("headerbackcolor", $("#headerbackcolor").val());
				data.append("headerfontcolor", $("#headerfontcolor").val());
				data.append("headerfontsize", $("#headerfontsize").val());
				data.append("menubackcolor", $("#menubackcolor").val());
				data.append("menufontcolor", $("#menufontcolor").val());
				data.append("menufontsize", $("#menufontsize").val());
				data.append("posttitlecolor", $("#posttitlecolor").val());
				data.append("posttitlefontsize", $("#posttitlefontsize").val());
				data.append("postcontentcolor", $("#postcontentcolor").val());
				data.append("postcontentfontsize", $("#postcontentfontsize").val());
				data.append("pagetitlecolor", $("#pagetitlecolor").val());
				data.append("pagetitlefontsize", $("#pagetitlefontsize").val());
				data.append("pagecontentcolor", $("#pagecontentcolor").val());
				data.append("pagecontentfontsize", $("#pagecontentfontsize").val());
				$.ajax({
					url: "/admin/theme",
					data: data,
					cache: false,
					contentType: false,
					async: false,
					processData: false,
					type: "POST",
					success: function(data){
						$http.get("/admin/theme").success(function(data){
							$scope.themes = data;
							$("#ThemeModal").modal("hide");
						});
					}
				});
			}
		}
	};
});
var app = angular.module("Mely", []);
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
app.controller("CommentCtrl", function($scope, $http){
	$http.get("/admin/comment").success(function(data){
		$scope.comments = data;
	});
	$scope.updateStatus = function(id,changeTo){
		$http.get("/admin/post/comment/" + id + "/" + changeTo).success(function(data){
			$http.get("/admin/comment").success(function(data){
				$scope.comments = data;
			});
		});
	};
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

$(document).ready(function(){
	$("#UserForm").bootstrapValidator({
		feedbackIcons: {
			valid: "glyphicon glyphicon-ok",
			invalid: "glyphicon glyphicon-remove",
			validating: "glyphicon glyphicon-refresh"
		},
		fields: {
			useremail: {
				validators: {
					notEmpty: {
						message: "The email address is required and cannot be empty"
					},
					emailAddress: {
						message: "The email address is not a valid email"
					}
				}
			},
			userpassword: {
				validators: {
					notEmpty: {
						message: "The password is required and cannot be empty"
					}
				}
			}
		}
	}).on("success.form.bv", function(e) {
	 	e.preventDefault();
	});
	$("#PostForm").bootstrapValidator({
		feedbackIcons: {
			valid: "glyphicon glyphicon-ok",
			invalid: "glyphicon glyphicon-remove",
			validating: "glyphicon glyphicon-refresh"
		},
		fields: {
			posttitle: {
				validators: {
					notEmpty: {
						message: "Post Title cannot be empty"
					},
				}
			},
			postcontent: {
				validators: {
					notEmpty: {
						message: "Post Title cannot be empty"
					}
				}
			},
			poststatus: {
				validators: {
					notEmpty: {
						message: "Post Status must be selected"
					}
				}
			},
			postcomments: {
				validators: {
					notEmpty: {
						message: "Post Comment Setting must be selected"
					}
				}
			},
		}
	}).on('success.form.bv', function(e) {
	 	e.preventDefault();
	});
	$("#PageForm").bootstrapValidator({
		feedbackIcons: {
			valid: "glyphicon glyphicon-ok",
			invalid: "glyphicon glyphicon-remove",
			validating: "glyphicon glyphicon-refresh"
		},
		fields: {
			pagetitle: {
				validators: {
					notEmpty: {
						message: "Page Title cannot be empty"
					},
				}
			},
			pagecontent: {
				validators: {
					notEmpty: {
						message: "Page Title cannot be empty"
					}
				}
			},
			pagestatus: {
				validators: {
					notEmpty: {
						message: "Page Status must be selected"
					}
				}
			},
			pageview: {
				validators: {
					notEmpty: {
						message: "Page Visibility must be selected"
					}
				}
			},
			pageorder: {
				validators: {
					notEmpty: {
						message: "Page Order must be entered"
					}
				}
			},
		}
	}).on('success.form.bv', function(e) {
	 	e.preventDefault();
	});
	$("#ThemeForm").bootstrapValidator({
		feedbackIcons: {
			valid: "glyphicon glyphicon-ok",
			invalid: "glyphicon glyphicon-remove",
			validating: "glyphicon glyphicon-refresh"
		},
		fields: {
			themename: {
				validators: {
					notEmpty: {
						message: "Theme Name cannot be empty"
					},
				}
			},
			themedescription: {
				validators: {
					notEmpty: {
						message: "Theme Description cannot be empty"
					}
				}
			},
			headerbackcolor: {
				validators: {
					notEmpty: {
						message: "Title Background Color must not be empty"
					}
				}
			},
			headerfontcolor: {
				validators: {
					notEmpty: {
						message: "Title Font Color must not be empty"
					}
				}
			},
			headerfontsize: {
				validators: {
					notEmpty: {
						message: "Title Font Size must not be empty"
					}
				}
			},
			menubackcolor: {
				validators: {
					notEmpty: {
						message: "Menu Background Color must not be empty"
					}
				}
			},
			menufontcolor: {
				validators: {
					notEmpty: {
						message: "Menu Font Color must not be empty"
					}
				}
			},
			menufontsize: {
				validators: {
					notEmpty: {
						message: "Menu Font Size must not be empty"
					}
				}
			},
			posttitlecolor: {
				validators: {
					notEmpty: {
						message: "Post Title Color must not be empty"
					}
				}
			},
			posttitlefontsize: {
				validators: {
					notEmpty: {
						message: "Post Title Font Size must not be empty"
					}
				}
			},
			postcontentcolor: {
				validators: {
					notEmpty: {
						message: "Post Content Color must not be empty"
					}
				}
			},
			postcontentfontsize: {
				validators: {
					notEmpty: {
						message: "Post Content Font Size must not be empty"
					}
				}
			},
			pagetitlecolor: {
				validators: {
					notEmpty: {
						message: "Page Title Color must not be empty"
					}
				}
			},
			pagetitlefontsize: {
				validators: {
					notEmpty: {
						message: "Page Title Font Size must not be empty"
					}
				}
			},
			pagecontentcolor: {
				validators: {
					notEmpty: {
						message: "Page Title Content Color must not be empty"
					}
				}
			},
			pagecontentfontsize: {
				validators: {
					notEmpty: {
						message: "Page Content Font Size must not be empty"
					}
				}
			},
			headerimage: {
                validators: {
                    file: {
                        extension: "jpeg,png,gif,jpg",
                        type: "image/jpeg,image/png,image/gif",
                        maxSize: 1048576,
                        message: "The selected file is not valid"
                    }
                }
            }
		}
	}).on('success.form.bv', function(e) {
	 	e.preventDefault();
	});
	$("#pagecontent").pagedownBootstrap();
	$("#postcontent").pagedownBootstrap();
});
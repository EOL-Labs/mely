var app = angular.module("MelyAdmin", []);
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
	$scope.activateTheme = function(id){
		$http.get("/admin/theme/activate/" + id).success(function(data){
			$http.get("/admin/theme").success(function(data){
				$scope.themes = data;
			});
		});
	};
//	$("#PageModal").on("hide.bs.modal", function() {
//		$("#PageForm").data("bootstrapValidator").resetForm(true);
//		$("#pageid").val("");
//	});
//	$scope.getPage = function(id){
//		$("#PageModal").modal("show");
//		$http.get("/admin/page/" + id).success(function(data){
//			$("#pageid").val(data.pageid);
//			$("#pagetitle").val(data.title);
//			$(".pagecontent").val(data.content);
//			$("#pagestatus").val(data.status);
//			$("#pageorder").val(data.order);
//			$("#pageview").val(data.onmenu);
//		});
//	};
	$scope.process = function(){
		$("#ThemeForm").data("bootstrapValidator").validate();
		var form = $("#ThemeForm").data("bootstrapValidator").isValid();
		if(form){
			if($("#pageid").val()){
//				$http.put("/admin/page", {
//					"mely-pageid": $("#pageid").val(),
//					"mely-page-title": $("#pagetitle").val(),
//					"mely-page-content": $(".pagecontent").val(),
//					"mely-page-status": $("#pagestatus").val(),
//					"page-order": $("#pageorder").val(),
//					"mely-page-menuview": $("#pageview").val()
//				}).success(function(){
//					$http.get("/admin/page").success(function(data){
//						$scope.pages = data;
//						$("#PageModal").modal("hide");
//					});
//				});
			}
			else{
				$http.post("/admin/theme",{
					"themename" : $("#themename").val(),
					"themedescription" : $("#themedescription").val(),
					"headerbackcolor" : $("#headerbackcolor").val(),
					"headerfontcolor" : $("#headerfontcolor").val(),
					"headerfontsize" : $("#headerfontsize").val(),
					"headerimage" : null,
					"menubackcolor" : $("#menubackcolor").val(),
					"menufontcolor" : $("#menufontcolor").val(),
					"menufontsize" : $("#menufontsize").val(),
					"posttitlecolor" : $("#posttitlecolor").val(),
					"posttitlefontsize" : $("#posttitlefontsize").val(),
					"postcontentcolor" : $("#postcontentcolor").val(),
					"postcontentfontsize" : $("#postcontentfontsize").val(),
					"pagetitlecolor" : $("#pagetitlecolor").val(),
					"pagetitlefontsize" : $("#pagetitlefontsize").val(),
					"pagecontentcolor" : $("#pagecontentcolor").val(),
					"pagecontentfontsize" : $("#pagecontentfontsize").val()
				}).success(function(data){
					//console.log(data);
					$http.get("/admin/theme").success(function(data){
						$scope.themes = data;
						$("#ThemeModal").modal("hide");
					});
				});
			}
		}
	};
//	$scope.delete = function(pageid){
//		$http.delete("/admin/page/" + pageid).success(function(){	
//			var pages = _.filter($scope.pages, function(obj){
//				return obj.pageId !== pageid;
//			});
//			$scope.pages = pages;
//		});
//	};
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
			}
		}
	}).on('success.form.bv', function(e) {
	 	e.preventDefault();
	});
	$("#pagecontent").pagedownBootstrap();
	$("#postcontent").pagedownBootstrap();




	// $("a.files").click(function(){
	// 	var file = encodeURIComponent($(this).attr("id"));
	// 	$.ajax({
	// 		url: "/admin/file/" + file.toLowerCase(),
	// 		type: "GET",
	// 		success: function(data){
	// 			$("#filecontent").val(data[0]);
	// 			$("#filename").val(data[1]);
	// 		}
	// 	});
	// });
	// $("a#save").click(function(){
	// 	var filename = $("#filename").val();
	// 	var content = $("#filecontent").val();
	// 	$.ajax({
	// 		url: "/admin/file/save",
	// 		type: "POST",
	// 		data:{
	// 			filename: filename,
	// 			content: content
	// 		},
	// 		success: function(data){
	// 			console.log(data);
	// 		}
	// 	});
	// });
});
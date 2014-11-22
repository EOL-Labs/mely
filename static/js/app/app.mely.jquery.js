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
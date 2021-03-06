app.controller("Welcome", function($scope, $http){
});
$(document).ready(function(){
	$("#Mely").bootstrapValidator({
		feedbackIcons:{
			valid: "glyphicon glyphicon-ok",
			invalid: "glyphicon glyphicon-remove",
			validating: "glyphicon glyphicon-refresh"
		},
		fields:{
			"mely-name":{
				validators:{
					notEmpty:{
						message: "Blog Name is required"
					}
				}
			},
			"mely-email":{
				validators:{
					notEmpty:{
						message: "Email Address is required"
					},
					emailAddress:{
						message: "Must be a valid Email Address"
					}
				}
			},
			"mely-password":{
				validators:{
					notEmpty:{
						message: "Password is required"
					},
				}
			}
		}
	}).on("success.form.bv", function(e){
	});
});
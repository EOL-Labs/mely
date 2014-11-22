app.controller("Login", function($scope, $http){
});
$(document).ready(function(){
	$("#LoginForm").bootstrapValidator({
		feedbackIcons:{
			valid: "glyphicon glyphicon-ok",
			invalid: "glyphicon glyphicon-remove",
			validating: "glyphicon glyphicon-refresh"
		},
		fields:{
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
	switch($(document).context.location.search){
		case "?invalid":
			$("#loginAlert").removeClass("hide");
		break;
	}
});
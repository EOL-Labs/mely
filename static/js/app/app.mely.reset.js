app.controller("Reset", function($scope, $http){
});
$(document).ready(function(){
	$("#ResetForm").bootstrapValidator({
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
			}
		}
	}).on("success.form.bv", function(e){
	});
	var message = $(document).context.location.search.replace("?","");
	if(message === "success" || message === "error"){
		$("#resetAlert").removeClass("hide");
	}
});
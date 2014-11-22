app.controller("Welcome", function($scope, $http){

	$scope.create = function(){
		//$("#Mely").data("bootstrapValidator").validate();
		//console.log($("#NewMely").data("bootstrapValidator"))
		//console.log($("#NewMely").data("bootstrapValidator").isValid());






	};
	//$scope.create();
});
$(document).ready(function(){
	$("#NewMely").bootstrapValidator({
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
		e.preventDefault();
	});
});
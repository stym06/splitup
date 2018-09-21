angular.module('registerApp',['userService'])
	.controller('regCtrl',regCtrl);

regCtrl.$inject = ['$scope','$http','$location','$timeout','User'];

function regCtrl($scope,$http,$location,$timeout,User){
	// console.log("Inside registration controller");
	var vm = this;
	vm.loading=false;
	vm.success=false;
	vm.failure=false;
	
	vm.regUser = function(regData){
		vm.loading=true;

		if(vm.regData.password==vm.regData.password2){

			User.create(vm.regData).then(function(data){
				console.log(data);
				vm.regData=null;
				vm.loading=false;
				vm.success=data.data.success;
				vm.failure=!data.data.success;
				vm.errorText=data.data.result;

				if(data.data.success){
					$timeout(function(){
						$location.path('/');
					},2000)
				}
			})

		}
		else{
			vm.loading=false;
		}
		
	}
}
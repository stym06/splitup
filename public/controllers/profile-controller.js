angular.module('profileApp',['authService'])
	.controller('profileCtrl',profileCtrl)
	.controller('googleCtrl',googleCtrl)

profileCtrl.$inject=['$scope','$http','$routeParams','Auth'];
googleCtrl.$inject=['$scope','$http','$routeParams','Auth','$location','$window'];

function profileCtrl($scope,$http,$routeParams,Auth){
	var vm = this;
	
	Auth.getUser().then(function(data){
		vm.userid=data.data.id;
		//Request all the user's info here
		
	})
	
}

function googleCtrl($scope,$http,$routeParams,Auth,$location,$window){
	var vm = this;

	if($window.location.pathname=='/googleerror'){
		vm.facebookError = "Email does not exist in DB";
	}
	else{
		console.log($routeParams.token);
		Auth.google($routeParams.token);
		$location.path('/');
	}

	
	
}
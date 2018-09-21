angular.module('loginApp',['authService'])
	.controller('mainCtrl',mainCtrl);

mainCtrl.$inject = ['$scope','$http','$location','$timeout','Auth','$rootScope','$window'];

function mainCtrl($scope,$http,$location,$timeout,Auth,$rootScope,$window){
	var vm = this;
	vm.loadme = false;

	vm.loggedIn = Auth.isLoggedIn();
	vm.loginFailure=false;

	$rootScope.$on('$routeChangeStart',function(){
		if(Auth.isLoggedIn()){
			vm.loggedIn=true;
			Auth.getUser().then(function(data){
				// console.log(data.data.username);
				// console.log(data);
				vm.username=data.data.username;
				
			})
		}
		vm.loadme=true;
	})

	vm.google = function(){
		$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google';
	}

	

	vm.loginUser = function(loginData){
		Auth.login(vm.loginData).then(function(data){
			// console.log(data);
			vm.loginData=null;
			if(data.data.success){
				vm.loggedIn=true;
				$timeout(function(){
					$location.path('/profile');
				},2000)
			}
			else{
				vm.loginFailure=true;
				vm.errorText=data.data.result;
			}
		})
	}

	vm.logout = function(){
		Auth.logout();
		$location.path('/logout');
		$timeout(function(){
			$location.path('/');
		},2000);
		vm.loggedIn = false;
	}
}

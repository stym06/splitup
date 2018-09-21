angular.module('groupCtrl',[])
	.controller('homeCtrl',homeCtrl);

homeCtrl.$inject=['$scope','$http'];

function homeCtrl($scope,$http){

	var vm=this;
	$http.get('/api/teams/all').success(function(response){
		vm.teamData=response;
		// console.log(response);
	})
}

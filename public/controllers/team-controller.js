angular.module('teamApp',[])
	.controller('teamCtrl',teamCtrl)

teamCtrl.$inject=['$scope','$http','$routeParams'];

function teamCtrl($scope,$http,$routeParams){
	var vm = this;
	var team_id=$routeParams.team_id;
	$http.get('/api/team/'+team_id).success(function(response){
		// console.log(response.team);
		var res = response.team[0];
		vm.teamName = res.name;
		vm.desc = res.desc;
		vm.oneTime = res.type;
		vm.count=res.count;
		vm.limit=res.limit;
	})
}
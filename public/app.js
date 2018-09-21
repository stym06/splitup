angular.module('userApp',['appRoutes','loginApp','groupCtrl','teamApp','profileApp','registerApp','userService','authService'])

	.config(function($httpProvider){
		$httpProvider.interceptors.push('AuthInterceptors');
	})
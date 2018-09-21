angular.module('appRoutes',['ngRoute'])

	.config(function($routeProvider,$locationProvider){

		$routeProvider

		.when('/',{
			templateUrl:'views/pages/home.html',
			controller:'homeCtrl',
			controllerAs:'home'
		})

		.when('/about',{
			templateUrl:'views/pages/about.html'
		})

		.when('/login',{
			templateUrl:'views/pages/users/login.html',
			authenticated:false
		})

		.when('/register',{
			templateUrl:'views/pages/users/register.html',
			controller:'regCtrl',
			controllerAs:'register',
			authenticated:false
		})

		.when('/team/:team_id',{
			templateUrl:'views/pages/team.html',
			controller:'teamCtrl',
			controllerAs:'team',
		})

		.when('/profile',{
			templateUrl:'views/pages/users/profile.html',
			controller:'profileCtrl',
			controllerAs:'profile',
			authenticated:true
		})

		.when('/logout',{
			templateUrl:'views/pages/logout.html',
			authenticated:true
		})

		.when('/google/:token',{
			templateUrl:'views/pages/social.html',
			controller:'googleCtrl',
			controllerAs:'google',
			authenticated:false
		})
		.when('/googleerror',{
			templateUrl:'views/pages/login.html',
			controller:'googleCtrl',
			controllerAs:'google',
			authenticated:false
		})
 

		.otherwise({redirectTo:'/'});

		 $locationProvider.html5Mode({
		 	enabled:true,
		 	requireBase:false
		 });

	})

	.run(['$rootScope','Auth','$location',function($rootScope,Auth,$location){
		$rootScope.$on('$routeChangeStart',function(event,next,current){
			if(next.$$route.authenticated == true){
				if(!Auth.isLoggedIn()){
					event.preventDefault();
					$location.path('/');
				}
			}
			else if(next.$$route.authenticated == false){
				if(Auth.isLoggedIn()){
					event.preventDefault();
					$location.path('/');
				}
			}
			else{
				// console.log('Doesnt matter');
			}
		})
	}])



angular.module('loginCtrl', [])

	.controller('LoginController', 
		[
			'$scope', 
			'$http', 
			'$location', 
			'sessServ',
			'messageCenterService', 

		function ($scope, $http, $location, sessServ, messageCenterService) {
			$scope.login = {};
			/*
				*/
			if ($scope.login.user === undefined) {
				var user = sessServ.getUser();
				if (user) {
					$scope.login.user = user
					$scope.login.loggedin = true;
				}
				else {
					$scope.login.loggedin = false;
				}
			}

			$scope.login.showLogin = function () {
				$scope.login.navLoginShow = !$scope.login.navLoginShow;
			}

			$scope.login.signIn = function () {
				var data = {
					username : $scope.login.username,
				  password : $scope.login.password
				}
				/*
				console.log(data);
					*/
				$http.post('/api/users/authenticate', data)
					.success( function (user) {
						$scope.login.user = user.username;
						$scope.login.loggedin = true;
						$scope.login.navLoginShow = false;
						/*
						*/
					})
					.error( function (error) {
						console.log(error);
					});
			}

			$scope.login.logout = function () {

				$http.post('/api/users/logout')
					.success( function(data) {
						$scope.login.user = undefined;
						$scope.login.loggedin = false;
						$location.path('/');
					})
					.error( function(data) {
						console.log(data);
					});
			}
		}
	])

	.directive('login', 
		function () {
			return {
				replace: true,
				restrict: 'E',
				templateUrl: '/partials/login.jade'
			}
		}
	)


	.directive('fileModel', ['$parse',
		function ($parse) {
			return {
				restrict: 'A',
				link: function (scope, element, attrs) {
					var model = $parse(attrs.fileModel);
					var modelSetter = model.assign;

					element.bind('change', function () {
						scope.$apply( function () {
							modelSetter(scope, element[0].files[0]);
						});
					});
				}
			};
		}
	]);

var controllers = angular.module('appmonitorControllers', []);

controllers.controller('ServersCtrl', [ '$scope', '$http', '$location', 'flash', '$routeParams',
		function($scope, $http, $location, flash, $routeParams) {
			$scope.servers = [];
			
			$scope.flash = flash;
			
			$scope.form = {};
	
			$scope.loadServers = function() {
				$http.get('services/servers').success(function(data) {
					$scope.servers = data;
				});
			};
			
			$scope.loadApps = function(server){
				if (server.apps == null) {
					$http.get('services/servers/' + server.id + '/apps').then(function successCallback(response) {
						console.log(JSON.stringify(response));
						if (response.status == 204) {
							server.loadAppsErrorMessage = 'There was a problem trying to contact server.';
						}
						else {
							server.apps = response.data;
							server.visible = !server.visible;
						}
//						server.viewHideAppsLabel = (server.visible) ? "Hide apps" : "View apps";
					});
				}
			};

			$scope.addServer = function() {
				$http.post('services/servers/', $scope.form).then(function successCallback(response) {
					flash.setMessage('The server was added.');
					$location.path('/servers');
				}, function errorCallback(response) { 
					console.log('erro.');
				});
			};
			
			$scope.loadServer = function() {
				$http.get('services/servers/' + $routeParams.serverId).then(function successCallback(response) {
					// TODO: handle id not found.
					$scope.form = response.data;
				});
			};

			$scope.editServer = function() {
				$http.post('services/servers/edit', $scope.form).then(function successCallback(response) {
					flash.setMessage('The server information was updated.');
					$location.path('/servers');
				}, function errorCallback(response) { 
					console.log('erro.');
				});
			};
			
			$scope.removeServer = function() {
				$http.post('services/servers/remove', $scope.form.id).then(function successCallback(response) {
					flash.setMessage('The server was removed.');
					$location.path('/servers');
				}, function errorCallback(response) { 
					console.log('erro.');
				});
			}
		} ]);

controllers.controller('ServerDetailCtrl', [ '$scope', '$routeParams',
		function($scope, $routeParams) {
			$scope.serverId = $routeParams.serverId;
		} ]);

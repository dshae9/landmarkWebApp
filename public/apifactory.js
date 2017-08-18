// handles http requests

var app = angular.module('landmarkModule');

app.factory('APIFactory', function($http){
	var locationData;
	var key = "AIzaSyDLI6aa4HIc-UGROfE6ITmgnsSO-ot9Wcw";

	return {
		getLocationData: getLocationData
	}

	function getLocationData(location){
		location = location || '-33.8670,151.1957';
		var baseUrl = `api-places?location=${location}&radius=50000&types=zoo`;
		var url = `${baseUrl}&key=${key}`;
		if (locationData){
			//if we already have data return this.
			return Promise.resolve(locationData); // Promise.resolve is a keyword that turns any data into a
			// promise value.
		}
	//if we don't have data, use http service to get data from reddit.
		return $http.get(url)
			.then(function(result){
				var promises = [];

				result.data.results.forEach(function(item){
					promises.push(getDetails(item.place_id));
				});

				return Promise.all(promises);
			}).then(function(data){
				locationData = data.map(function(item){
					return item.data.result;
				});
				return locationData;
			});

		function getDetails(placeId){
			return $http.get(`api-details?key=${key}&placeid=${placeId}`);
		}
	}
});

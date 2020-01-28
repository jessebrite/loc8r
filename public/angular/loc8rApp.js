angular.module('loc8rApp', []);

var locationListCtrl = function($scope) {
	$scope.data = {
		locations: [{
			name: 'Burger Quuen',
			address: '125 High Street, Reading, RG6 1PS',
			rating: 3,
			facilities: ['Hot drinks', 'Food', 'Premium wifi'],
			distance: '0.296456',
			_id: '5370a35f2536f6785f8dfb6a'
			}, {
				name: 'Costy',
				address: '125 High Street, Reading, RG6 1PS',
			rating: 3,
			facilities: ['Hot drinks', 'Food', 'Premium wifi'],
			distance: '0.296456',
			_id: '5370a35f2536f6785f8dfb6a'
		}]
	};
}

var _isNumeric = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

var formatDistance = function() {
	return function(distance) {
		var numDistance, unit;
		// If distance is found and is a number, go ahead and parse it
		if (distance && _isNumeric(distance)) {
			if (distance > 1) {
				numDistance = parseFloat(distance).toFixed(1);
				unit = 'km';
			} else {
				numDistance = parseInt(distance * 1000,00);
				unit = 'm';
			}
			return numDistance + unit;
			// Else, log error to consle
		} else {
			return '?';
			console.log('Disatnce must be a number. ' + distance + ' found');
		}
	}
}

angular
	.module('loc8rApp')
	.controller('locationListCtrl', locationListCtrl)
	.filter('formatDistance', formatDistance)
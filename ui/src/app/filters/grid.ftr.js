'use strict';
angular.module('ui')
.filter('unique', function () {

  return function (items, filterOn, field) {

    if (filterOn === false) {
      return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      var newItems = [];

      var extractValueToCompare = function (item) {
    	var fieldItem = field?item[field]:item;  
        if (angular.isObject(fieldItem) && angular.isString(filterOn)) {
          return fieldItem[filterOn] || null;
        } else {
          return fieldItem || null;
        }
      };

      angular.forEach(items, function (item) {
        var isDuplicate = false;

        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }

      });
      items = newItems;
    }
    return items;
  };
})
.filter('propFilter', function() {
	return function(items, prop, search ,field ,empty) {
		var out = [];
		if (angular.isArray(items)) {
			items.forEach(function(item) {
				var fieldItem = field?item[field]:item;  
				var itemMatches = false;

				var text = search.toLowerCase();
				var valueField = fieldItem[prop];
				if(!valueField || valueField === null){
					valueField = empty;
				}
				if (valueField.toString().toLowerCase().indexOf(text) !== -1) {
					itemMatches = true;
				}

				if (itemMatches) {
					out.push(item);
				}
			});
		} else {
			// Let the output be the input untouched
			out = items;
		}

		return out;
	};
});

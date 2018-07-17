(function() {
    'use strict';
//#1,#2 Declare app  and attach to DOM of html
    angular.module('NarrowItDownApp', [])
        .controller("NarrowItDownController", NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', foundItemsDirective)
        .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");
// Inject MenuSearchService with http service and API Constant
        MenuSearchService.$inject = ['$http', 'ApiBasePath'];
// #5 NarrowItDownController injected with MenuSearchService
        NarrowItDownController.$inject = ['MenuSearchService'];

// #4 MenuSearchService Start
        function MenuSearchService($http, ApiBasePath){
            var service = this;
//define array to store returned values
            var foundItemsList = [];
            service.getMatchedMenuItems = function(searchTerm) {
//Throws console error unless founditemslist defined within function
              foundItemsList = [];
                return $http({
                    method: "GET",
                    url: (ApiBasePath + "/menu_items.json")
                }).then(function(result) {
// loop through array matching characters in searchterm(lowercase) defined in NarrowItDownController
                    for (var i in result.data.menu_items) {
                        if (result.data.menu_items[i].description.search(searchTerm) != -1 && searchTerm != "") {
                            foundItemsList.push(result.data.menu_items[i]);
                        }
                    }
// Return array populated by matching search items
                    return foundItemsList;
                });
            };
// Splice remove Lecture 30pt2
            service.removeItem = function (itemIndex) {
              foundItemsList.splice(itemIndex,1);
            };
        }
// MenuSearchService End

//#3 NarrowItDownController Start
    function NarrowItDownController(MenuSearchService){
        var list = this;
        list.searchTerm = "";
        //#5
        list.found = [];
        list.search = function() {
            var promise = MenuSearchService.getMatchedMenuItems(list.searchTerm);
            promise.then(function(response) {
//
                    if(!response.length)
                        list.found = 0;
                    else
                        list.found = response;
                })
                .catch(function(error) {
                })
        };
        list.removeItem = function (itemIndex) {
            MenuSearchService.removeItem(itemIndex);
        };
    };
//NarrowItDownController End

//#6 Directive Start
    function foundItemsDirective(){
        var ddo = {
            templateUrl:'foundItems.html',
            scope: {
               items: '<',
//badremove    badRemove:'=',
               onRemove: '&'
            },
        };
    return ddo;
  };
//Directive End
})();

'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('navBar', [
  function() {
    return {
      controller: function($scope, pagesFactory, $location) {
        var path = $location.path().substr(0, 6);
        if (path != "/admin") {
          pagesFactory.getPages().then(
            function(response) {
              $scope.navLinks = response.data;
            });
        } else if(path == "/admin" && $scope.loggedInUser) {
            $scope.navLinks = [{
              title: 'User List',
              url: 'admin/user-list'
            },
            {
              title: 'Pages',
              url: 'admin/pages'
            }]
          }
        },

        templateUrl: 'partials/directives/nav.html'
      };
  }
]).
directive('adminLogin', [
  function() {
    return {
      controller: function($scope, $cookies) {
        var locationPath = $location.path().substr(0, 6);
        $scope.$watch(function () {
          return $cookies.get('loggedInUser', {path: "/"});
        }, function (value) {
          $scope.loggedInUser = value;
          $scope.userType = $cookies.get('userType');
          $scope.path = locationPath;
        });
      },
      templateUrl: 'partials/directives/admin-login.html'
    };
  }
]).
directive('dateNow', ['$filter', function($filter) {
  return {
    link: function( $scope, $element, $attrs) {
      $element.text($filter('date')(new Date(), $attrs.dateNow));
    }
  };
}])  ;

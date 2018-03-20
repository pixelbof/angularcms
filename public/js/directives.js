'use strict';

/* Directives */

angular.module('myApp.directives', [])
.directive('socialMedia', [
  function() {
    return {
      controller: function($scope, socialFactory, $location) {
          $scope.$on('$routeChangeSuccess', function() {
            $scope.socialMedia = "";

            socialFactory.getSocialMedia().then(
              function(response) {
                $scope.socialMedia = response.data;
              });
          });
        },
        templateUrl: 'partials/directives/socialMedia.html'
      };
  }
])
.directive('navBar', [
  function() {
    return {
      controller: function($scope, pagesFactory, $location) {
          $scope.$on('$routeChangeSuccess', function() {
            $scope.navLinks = "";
            if ($location.path().split("/")[1] != "admin") {
              pagesFactory.getPages().then(
                function(response) {
                  $scope.navLinks = response.data;
                });
            } 

            if($location.path().split("/")[1] == "admin") {
              $scope.navLinks = "";

              if($scope.loggedInUser) {
                $scope.navLinks = [{
                  title: 'Dashboard',
                  url: 'admin/dashboard'
                },
                {
                  title: 'User List',
                  url: 'admin/user-list'
                },
                {
                  title: 'Pages',
                  url: 'admin/pages'
                },
                {
                  title: 'Shop Admin',
                  url: 'admin/shop-display'
                },
                {
                  title: 'Transaction List',
                  url: 'admin/shop-transactions'
                },
                {
                  title: 'Social Media',
                  url: 'admin/socialMedia'
                }]
              }
            }
          });
        },
        templateUrl: 'partials/directives/nav.html'
      };
  }
])
.directive('adminLogin', [
  function() {
    return {
      controller: function($scope, $cookies,$localstorage, $location) {
        var locationPath = $location.path().substr(0, 6);
        $scope.$watch(function () {
          return $cookies.get('loggedInUser', {path: "/"});
        }, function (value) {
          $scope.loggedInUser = value;
          $scope.userType = $localstorage.get('userType');
          $scope.path = locationPath;
        });
      },
      templateUrl: 'partials/directives/admin-login.html'
    };
  }
])
.directive('dateNow', ['$filter', function($filter) {
  return {
    link: function( $scope, $element, $attrs) {
      $element.text($filter('date')(new Date(), $attrs.dateNow));
    }
  };
}])  ;

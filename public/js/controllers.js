'use strict';
//GLOBAL CONTROLLERS FOR WHOLE APP
angular.module('myApp.controllers', []).
controller('AppCtrl', ['$scope', 'AuthService','flashMessageService','$location', '$cookies', 
    function($scope,AuthService,flashMessageService,$location,$cookies) {
        $scope.site = {
            logo: "img/angcms-logo.png"
        };

        $scope.location = $location['$$path'].split("/")[1];
        $scope.userType = $cookies.get('userType');

        console.log($scope.userType)

          if($scope.location == "admin" && $scope.userType == "user") {
            $location.path("/");
            flashMessageService.setMessage("You are not an admin of this application, you are not authorised to be in this area");
          }
    }
])

// USER CONTROLLERS
.controller('PageCtrl', ['$scope','pagesFactory', '$routeParams', '$sce', function($scope, pagesFactory, $routeParams,$sce) {
      var url = $routeParams.url;
      pagesFactory.getPageContent(url).then(
        function(response) {
          $scope.pageContent = {};
          $scope.pageContent.title = response.data.title;
          $scope.pageContent.content = $sce.trustAsHtml(response.data.content);

        }, function() {
            console.log('error fetching data');
    });
}]).
controller('liveStream', ['$scope','AuthService','flashMessageService','$location',
    function($scope,AuthService,flashMessageService,$location) {
      flashMessageService.setMessage("loading live stream");
    }
])

//ADMIN CONTROLLERS
.controller('AdminPagesCtrl', ['$scope', '$log', 'pagesFactory',
  function($scope, $log, pagesFactory) {
    
    pagesFactory.getPages().then(
      function(response) {
        $scope.allPages = response.data;
      },
      function(err) {
        $log.error(err);
      });

      $scope.deletePage = function(id) {
        pagesFactory.deletePage(id);
      };

    }
]).
controller('AddEditPageCtrl', ['$scope', '$log', 'pagesFactory', '$routeParams', '$location', 'flashMessageService', '$filter', 
function($scope, $log, pagesFactory, $routeParams, $location, flashMessageService, $filter) {
        $scope.pageContent = {};
        $scope.pageContent._id = $routeParams.id;
        $scope.heading = "Add a New Page";
        $scope.updateURL=function(){
        $scope.pageContent.url=$filter('formatURL')($scope.pageContent.title);
      }

        if ($scope.pageContent._id !== 0) {
          $scope.heading = "Update Page";
          pagesFactory.getAdminPageContent($scope.pageContent._id).then(
              function(response) {
                $scope.pageContent = response.data;
                $log.info($scope.pageContent);
              },
              function(err) {
                $log.error(err);
              });
        }

        $scope.savePage = function() {
          pagesFactory.savePage($scope.pageContent).then(
            function() {
              flashMessageService.setMessage("Page Saved Successfully");
              flashMessageService.setType("success");
              $location.path('/admin/pages');
            },
            function() {
              $log.error('error saving data');
            }
          );
        };
    }
])

//CENTRAL CONTROLLERS FOR ALL USERS
.controller('CentralRegisterCtrl', ['$scope', '$log', 'UserRegisterService', 'flashMessageService',
  function($scope, $log, UserRegisterService, flashMessageService) {
    $scope.user = {};
    $scope.addUser = function() {
      UserRegisterService.addUser($scope.user).then(
        function(response) {
          $scope.allPages = response.data;
          flashMessageService.setMessage("New user added successfully");
        },
        function(err) {
          $log.error(err);
        });
    }
  }
]).
controller('CentralLoginCtrl', ['$scope', '$location', '$cookies', 'AuthService','$log','flashMessageService',
    function($scope, $location, $cookies, AuthService, $log, flashMessageService) {
      $scope.credentials = {
        username: '',
        password: '',
        userType: ''
      };
      $scope.login = function(credentials) {
        AuthService.login(credentials).then(
          function(res, err) {
            $cookies.put('loggedInUser', res.data.user);
            $cookies.put('userType', res.data.userTypes);
            if(res.data.userTypes == "admin")
                $location.path('/admin/pages');
            else
                $location.path('/');
          },
          function(err) {
            flashMessageService.setMessage(err.data);

            $log.log(err);
          });
        };
    }
]).
controller('CentralLogoutCtrl', ['$scope', '$location', '$cookies', 'AuthService','$log','flashMessageService',
    function($scope, $location, $cookies, AuthService, $log, flashMessageService) {
      $cookies.remove('loggedInUser', { path: '/' });
      $scope.loggedInUser = '';
      AuthService.logout().then(
        function() {
          if($cookies.get('userType') == 'user') {
              $location.path('/');
          } else {
              $location.path('/admin/login');
          }
          $cookies.remove('userType', { path: '/' });
          flashMessageService.setMessage("Successfully logged out");
        }, 
        function(err) {
          console.log("error: " + JSON.stringify(err))
            console.log('there was an error tying to logout');
        }
      );
}])
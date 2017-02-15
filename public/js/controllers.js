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
        $scope.user = $cookies.get('loggedInUser');

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
      var now = new Date();

      $scope.sunday = now.getDay() == 0;
      $scope.hour = now.getHours() >= 18;

      console.log($scope.sunday + ' ' + $scope.hour)
      //flashMessageService.setMessage("loading live stream");
    }
]).
controller('UserProfileCtrl', ['$scope','$cookies', 'AuthService','flashMessageService','$location',
    function($scope,$cookies,AuthService,flashMessageService,$location) {
      $scope.currentUser = $cookies.get('loggedInUser');
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
.controller('CentralRegisterCtrl', ['$scope','$controller','$rootScope', '$log','$location', 'UserRegisterService', 'flashMessageService',
  function($scope,$controller,$rootScope, $log, $location, UserRegisterService, flashMessageService) {
    $scope.newUser = {
        username: '',
        password: '',
        userType: '',
        accountStatus: 'active',
    };

    if($scope.location == "user") {
      $scope.newUser.userType = "user";
    }

    $scope.addUser = function() {
      UserRegisterService.addUser($scope.newUser).then(
        function(response) {
          flashMessageService.setMessage("New user added successfully");
          var newUserScope = $scope.$new();
          $controller('CentralLoginCtrl', {$scope : newUserScope});
          console.log($scope.newUser)
          newUserScope.login($scope.newUser);
        },
        function(err) {
          $log.error(err);
        });
    };
  }
]).
controller('CentralLoginCtrl', ['$scope', '$rootScope', '$location', '$cookies', 'AuthService','$log','flashMessageService',
    function($scope, $rootScope, $location, $cookies, AuthService, $log, flashMessageService) {

      $scope.credentials = {
        username: '',
        password: '',
        userType: '',
        accountStatus:''
      };

      $scope.login = function(credentials) {
        console.log(credentials)
        AuthService.login(credentials).then(
          function(res, err) {
            $cookies.put('loggedInUser', res.data.user);
            $cookies.put('userType', res.data.userType);

            if(res.data.userType == "admin")
                $location.path('/admin/pages');
            else if(res.data.userType == "user" && res.data.accountStatus == "active")
                $location.path('/user/profile/'+ $cookies.get('loggedInUser'));
            else
                $location.path('/');
                flashMessageService.setMessage("Your account has been disabled by the admin, you are unable to login because of this");
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
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

      //flashMessageService.setMessage("loading live stream");
    }
]).
controller('UserProfileCtrl', ['$scope','$cookies', 'UserService','flashMessageService','$location', '$log',
    function($scope,$cookies,UserService,flashMessageService,$location,$log) {

        UserService.getProfile($scope.loggedInUser).then(
        function(response) {
          $scope.userProfile = {};
          $scope.userProfile = response.data;

          if(response.data == "") {
            $location.path('/user/update-profile')
          }
        },
        function(err) {
          console.log('error fetching data: ' + JSON.stringify(err));
        });
    }
]).
controller('UserUpdateProfileCtrl', ['$scope', '$timeout', '$log', 'UserService', '$routeParams', '$location', 'flashMessageService', '$filter', '$cookies', 'base64',
function($scope, $timeout, $log, UserService, $routeParams, $location, flashMessageService, $filter, $cookies, base64) {
        $scope.userProfile = {};
        $scope.userProfile.profileImage;
        $scope.userProfile.username = $scope.loggedInUser;
        $scope.loggedInUser = $cookies.get('loggedInUser');
        if($scope.userProfile.dateAdded == null) {
          $scope.userProfile.dateAdded = new Date(Date.now());
        }

          function getBase64(file) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
              $scope.userProfile.profileImage = reader.result;
            };
            reader.onerror = function (error) {
              console.log('Error: ', error);
            };
          }

        UserService.getProfile($scope.loggedInUser).then(
        function(response) {
          $scope.userProfile = response.data;
          $scope.userProfile.dob = new Date($scope.userProfile.dob);
          $scope.userProfile.dateAdded = new Date($scope.userProfile.dateAdded);
        },
        function(err) {
          $log.error(err);
        });

        $scope.saveProfile = function() {
          var files = document.getElementById('profileImage').files;

          if(files.length > 0) {
            getBase64(files[0])
          }

          $timeout((function() {
          UserService.updateProfile($scope.userProfile).then(
            function(msg) {
              $location.path('/user/profile/' + $scope.loggedInUser);
              flashMessageService.setMessage(msg.data);
            },
            function(err) {
              $log.error('error saving data: ' + JSON.stringify(err));
            }
          )
          }), 1000);
        };
    }
])

//ADMIN CONTROLLERS
.controller('AdminDashboardCtrl', ['$scope', '$log', 'pagesFactory',
  function($scope, $log, pagesFactory) {

    }
]).
controller('AdminUserListCtrl', ['$scope', '$log', 'UserService',
  function($scope, $log, UserService) {
    UserService.getUsers().then(
      function(response) {
        $scope.allUsers = response.data;
      },
      function(err) {
        $log.error(err);
      });
  }
]).
controller('AdminPagesCtrl', ['$scope', '$route', '$log', 'pagesFactory', '$location', 'flashMessageService',
  function($scope, $route, $log, pagesFactory, $location, flashMessageService) {
    
    pagesFactory.getPages().then(
      function(response) {
        $scope.allPages = response.data;
      },
      function(err) {
        $log.error(err);
      });

      $scope.deletePage = function(id) {
        pagesFactory.deletePage(id).then(function() {
            flashMessageService.setMessage("Page deleted Successfully");
            $route.reload();
        });
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
.controller('CentralRegisterCtrl', ['$scope','$controller','$rootScope', '$log','$location', 'UserRegisterService', 'UsernameCheckService', 'flashMessageService',
  function($scope,$controller,$rootScope, $log, $location, UserRegisterService, UsernameCheckService, flashMessageService) {
    $scope.newUser = {
        username: '',
        password: '',
        userType: '',
        accountStatus: 'active',
    };

    if($scope.location == "user") {
      $scope.newUser.userType = "user";
    }

    $scope.checkUsername = function() {
      UsernameCheckService.checkUsername($scope.newUser.username).then(
        function(res) {
          if(res.data !== 'false') {
            flashMessageService.setMessage("This user already exists");
          } else {
            $scope.addUser($scope.newUser)
          }
        },
      function(err) {
        $log.error(err);
      });
    };

    $scope.addUser = function() {
      UserRegisterService.addUser($scope.newUser).then(
      function(response) {
        flashMessageService.setMessage("New user added successfully");
        var newUserScope = $scope.$new();
        $controller('CentralLoginCtrl', {$scope : newUserScope});
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
        AuthService.login(credentials).then(
          function(res, err) {
            $cookies.put('loggedInUser', res.data.user);
            $cookies.put('userType', res.data.userType);

            if(res.data.userType == "admin")
                $location.path('/admin/dashboard');
            else if(res.data.userType == "user" && res.data.accountStatus == "active")
                $location.path('/user/profile/'+ $cookies.get('loggedInUser'));
            else if(res.data.accountStatus != "active") {
                $location.path('/');
                flashMessageService.setMessage("Your account has been disabled by the admin, you are unable to login because of this");
            }
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
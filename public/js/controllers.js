'use strict';
//GLOBAL CONTROLLERS FOR WHOLE APP
angular.module('myApp.controllers', []).
controller('AppCtrl', ['$scope', '$rootScope', 'UserService','flashMessageService','$location', '$cookies', '$interval',
    function($scope,$rootScope,UserService,flashMessageService,$location,$cookies,$interval) {
        $scope.site = {
            logo: "img/houseology-logo.png"
        };

        $scope.location = $location['$$path'].split("/")[1];
        $scope.userType = $cookies.get('userType');
        $scope.user = $cookies.get('loggedInUser');

        $scope.$on('user-status-change', function(event, args) {
          UserService.checkAccountStatus($scope.user).then(
            function(response) {
              $rootScope.accountStatus = response.data.accountStatus;
            });
        });
        
        $scope.$watch(function () {
            return $rootScope.accountStatus;
        }, function(value) {
            if(value == 'disabled') {
                $location.path("/");
                $cookies.remove('userType', {path: '/'});
                $cookies.remove('loggedInUser', {path: '/'});
                flashMessageService.setMessage("The admin has disabled your account")
            }
        })

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
controller('v-pods', ['$scope','$cookies', 'vodFactory', '$routeParams', '$sce', 
    function($scope, $cookies, vodFactory, $routeParams,$sce) {
    $scope.loggedInUser = $cookies.get('loggedInUser');

     vodFactory.getAllVods().then(
        function(response) {
            $scope.vodContent = response.data;
        }, function() {
          console.log("unable to fetch data for vods");
        }
     );
}]).
controller('shopCtrl', ['$scope', 'localStorage', '$rootScope', 'flashMessageService','$location', '$route', 'shopFactory', '$sce',
    function($scope,localStorage,$rootScope,flashMessageService,$location,$route, shopFactory, $sce) {
      shopFactory.getItems().then(function(res) {
        $scope.basketProducts = [];
        $scope.currentPrice = 0;
        $scope.basketLength = 0;
        $scope.totalPrice = 0; 
        $scope.products = '';
        $scope.products = res.data;

        $scope.products.description = $sce.trustAsHtml(res.data.productDescription);
        $scope.productLength = res.data.length;
      }, function(err) {
        flashMessageService("unable to retrieve products");
      });

      $scope.addToBasket = function(productName, productPrice, productSize) {
        $scope.basketProducts.push({name:productName, price:productPrice, size:productSize});
        $scope.currentPrice = $scope.totalPrice + productPrice;
        $scope.totalPrice = $scope.currentPrice;
      }

      $scope.checkout = function() {
        $rootScope.products = $scope.basketProducts;
        $rootScope.totalAmount = $scope.totalPrice;
        $location.path("/shop/checkout");
      }
    }
])
.controller('shopCheckoutCtrl', ['$scope', '$rootScope', '$location', '$route', '$log', 'shopFactory', 'flashMessageService',
  function($scope, $rootScope, $location, $route, $log, shopFactory, flashMessageService) {
    console.log("shop checkout control")
    $scope.products = {};
    $scope.products = $rootScope.products;

    $scope.totalAmount = $rootScope.totalAmount;

    $scope.PaymentSuccess = function(address) {
      $scope.userAddress = address;
      for(var i = 0; i < $scope.products.length; i++) {
        $scope.username = $scope.loggedInUser ? $scope.loggedInUser : "guest"
        $scope.productHistory = {};
        $scope.productHistory.userName = $scope.username;
        $scope.productHistory.userAddress = $scope.userAddress;
        $scope.productHistory.productName = $scope.products[i].name;
        $scope.productHistory.productSize = $scope.products[i].size;
        $scope.productHistory.productPrice = $scope.products[i].price;
        
        shopFactory.setPaymentHistory($scope.productHistory).then(function(res) {
            $location.path("/shop/payment/success");
        },
        function(err) {
          $log.error('error saving data: ' + JSON.stringify(err));
        });
      }
    }

    $scope.PaymentError = function() {
      console.log("payment error hit")
      
      
    }

    $scope.PaymentCancelled = function() {
      console.log("payment cancelled hit")
      
      
    }

    /*shopFactory.getItems().then(
      function(response) {
        $scope.shopItemContent = response.data;
      },
      function(err) {
        $log.error(err);
      });
    }*/
  }

])
.controller('shopPaymentSuccessCtrl', ['$scope', '$rootScope', '$location', '$route', '$log', 'shopFactory', 'flashMessageService',
  function($scope, $rootScope, $location, $route, $log, shopFactory, flashMessageService) {
    $scope.products = $rootScope.products;

    console.log("success payment" + $rootScope.products)
  }]).
controller('AdminTransactionsCtrl', ['$scope', 'localStorage', '$rootScope', 'flashMessageService','$location', '$route', 'shopFactory', '$sce',
    function($scope,localStorage,$rootScope,flashMessageService,$location,$route, shopFactory, $sce) {
      $scope.orders = {};
      $scope.statusUpdate = ["processing", "delayed", "posted", "out of stock", "cancelled", "refunded"];

      shopFactory.getCurrentTransactions().then(function(res) {
        $scope.orders = res.data;
      }, function(err) {
        flashMessageService("unable to retrieve products");
      });

      $scope.updateStatus = function(id, status) {
          shopFactory.updateTransaction(id, status).then(function(res) {
            flashMessageService.setMessage(res.data);
            $route.reload();
          }, function(err) {
            flashMessageService.setMessage("unable to update status of this order");
          });
        
      }
    }
])
.controller('liveStream', ['$scope','$cookies', 'AuthService','flashMessageService','$location', '$route',
    function($scope,$cookies,AuthService,flashMessageService,$location,$route) {
      var now = new Date();

      $scope.loggedInUser = $cookies.get('loggedInUser');
      $scope.userType = $cookies.get('userType');

      $scope.sunday = now.getDay() == 0;
      $scope.hour = now.getHours() >= 13;
      
    }
]).
controller('UserProfileCtrl', ['$scope','$cookies', 'UserService','flashMessageService','$location', '$log',
    function($scope,$cookies,UserService,flashMessageService,$location,$log) {
        $scope.user = $location.path().split("/")[3];

        UserService.getProfile($scope.user).then(
        function(response) {
          $scope.userProfile = {};
          $scope.userProfile = response.data;

          if($scope.location != 'admin' && response.data == "") {
              $location.path('/user/update-profile');
          }
        },
        function(err) {
          console.log('error fetching data: ' + JSON.stringify(err));
        });
    }
]).
controller('UserUpdateProfileCtrl', ['$scope', '$timeout', '$log', 'UserService', '$routeParams', '$location', 'flashMessageService', '$filter', '$cookies',
function($scope, $timeout, $log, UserService, $routeParams, $location, flashMessageService, $filter, $cookies) {
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
        
        if(UserService.getProfile($scope.loggedInUser) != null) {
          UserService.getProfile($scope.loggedInUser).then(
          function(response) {
            
            if(response.data) {
              $scope.userProfile = response.data;
              $scope.userProfile.dob = new Date($scope.userProfile.dob);
              $scope.userProfile.dateAdded = new Date($scope.userProfile.dateAdded);
            }
          },
          function(err) {
            $log.error(err);
          });
        }

        $scope.saveProfile = function() {
          var files = document.getElementById('profileImage').files;
          if(files.length > 0) {
            if(files[0].size <= 700000) {
              getBase64(files[0])
            } else {
              flashMessageService.setMessage("The file you supplied is over 700kb");
              return false;
            }
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
controller('AdminUserListCtrl', ['$scope','$rootScope', '$route', '$log', 'UserService', 'flashMessageService',
  function($scope, $rootScope, $route, $log, UserService, flashMessageService) {
    UserService.getUsers().then(
      function(response) {
        $scope.allUsers = response.data;
      },
      function(err) {
        $log.error(err);
      });
      
    $scope.deleteUser = function(id) {
        UserService.deleteUser(id).then(
          function() {
            flashMessageService.setMessage("User "+ id +" deleted Successfully");
            $route.reload();
          }, function(err) {
            $log.error(err);
          });
      };

      $scope.disableUser = function(id) {
        UserService.disableUser(id).then(
          function() {
            flashMessageService.setMessage("User "+ id +" disabled Successfully");
            $rootScope.$broadcast('user-status-change');
            $route.reload();
          }, function(err) {
            $log.error(err);
          }
        )
      };

      $scope.enableUser = function(id) {
        UserService.enableUser(id).then(
          function() {
            flashMessageService.setMessage("User "+ id +" enabled Successfully");
            $rootScope.$broadcast('user-status-change');
            $route.reload();
          }, function(err) {
            $log.error(err);
          }
        )
      };
  }
])
.controller('AdminPagesCtrl', ['$scope', '$route', '$log', 'pagesFactory', '$location', 'flashMessageService',
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
])
.controller('AddEditPageCtrl', ['$scope', '$log', 'pagesFactory', '$routeParams', '$location', 'flashMessageService', '$filter', 
  function($scope, $log, pagesFactory, $routeParams, $location, flashMessageService, $filter) {
        $scope.pageContent = {};
        $scope.pageContent._id = $routeParams.id;
        $scope.heading = "Add a New Page";
        $scope.updateURL=function(){
        $scope.pageContent.url=$filter('formatURL')($scope.pageContent.title);
      }

      $scope.tinymceOptions = {
        onChange: function(e) {
          // put logic here for keypress and cut/paste changes
        },
        inline: false,
        plugins : [
          'advlist autolink lists link charmap preview hr anchor',
          'searchreplace wordcount visualblocks visualchars code',
          'insertdatetime nonbreaking table contextmenu',
          'emoticons paste textcolor colorpicker textpattern codesample toc image'
          ],
        toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link',
        toolbar2: 'preview | forecolor backcolor emoticons | codesample | image',
        code_dialog_height: 200,
        skin: 'lightgray',
        themes : 'modern',
        browser_spellcheck: true
      };

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
.controller('AdminSocialMediaCtrl', ['$scope', '$route', '$log', 'socialFactory', '$location', 'flashMessageService',
  function($scope, $route, $log, socialFactory, $location, flashMessageService) {
    
    socialFactory.getSocialMedia().then(
      function(response) {
        $scope.socialMediaContent = response.data;
      },
      function(err) {
        $log.error(err);
      });

      $scope.deleteSocialMedia = function(id) {
        socialFactory.deleteSocialMedia(id).then(function() {
            flashMessageService.setMessage("Social media item deleted Successfully");
            $route.reload();
        });
      };

    }
])
.controller('AddEditSocialMediaCtrl', ['$scope', '$log', 'socialFactory', '$routeParams', '$location', 'flashMessageService', 
  function($scope, $log, socialFactory, $routeParams, $location, flashMessageService) {
        $scope.socialMediaContent = {};
        $scope.socialMediaContent._id = $routeParams.id;
        $scope.heading = "Add a new social media item";
        $scope.socialItem = ["Facebook", "Twitter", "TuneIn", "YouTube", "Instagram", "Reddit", "Pinterest", "Tumblr", "Google+", "LinkedIn", "iTunes"];

        if ($scope.socialMediaContent._id !== 0) {
          $scope.heading = "Update existing social media item";
          socialFactory.getSocialMediaContent($scope.socialMediaContent._id).then(
              function(response) {
                $scope.socialMediaContent = response.data;
                $log.info($scope.socialMediaContent);
              },
              function(err) {
                $log.error(err);
              });
        }

        $scope.saveSocialMedia = function() {
          socialFactory.saveSocialMedia($scope.socialMediaContent).then(
            function() {
              flashMessageService.setMessage("Social media item saved Successfully");
              $location.path('/admin/socialMedia');
            },
            function() {
              $log.error('error saving data');
            }
          );
        };
    }
])
.controller('AdminShopDisplayCtrl', ['$scope', '$route', '$log', 'shopFactory', '$location', 'flashMessageService',
  function($scope, $route, $log, shopFactory, $location, flashMessageService) {
    
    shopFactory.getItems().then(
      function(response) {
        $scope.shopItemContent = response.data;
      },
      function(err) {
        $log.error(err);
      });

      $scope.deleteSocialMedia = function(id) {
        shopFactory.deleteSocialMedia(id).then(function() {
            flashMessageService.setMessage("Social media item deleted Successfully");
            $route.reload();
        });
      };

    }
])
.controller('AdminAddEditShopCtrl', ['$scope', '$location', '$timeout', '$log', 'shopFactory', '$routeParams', '$location', 'flashMessageService', 
  function($scope, $location, $timeout, $log, shopFactory, $routeParams, flashMessageService) {
        $scope.shopItemContent = {};
        $scope.shopItemContent._id = $routeParams.id;
        $scope.heading = "Add a new shop item";
        $scope.productSizesSelect = ["small", "medium", "large"];

        function getBase64(file) {
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
            $scope.shopItemContent.productImage = reader.result;

            console.log("shop item to save", $scope.shopItemContent)
            shopFactory.saveShopItem($scope.shopItemContent).then(
              function() {
                console.log("success")
                $location.path('/admin/shop-display');
              },
              function() {
                $log.error('error saving data');
              }
            );
          };
          reader.onerror = function (error) {
            console.log('Error: ', error);
          };
        }

        if ($scope.shopItemContent._id != 0) {
          $scope.heading = "Update existing item";
          shopFactory.getItems($scope.shopItemContent._id).then(
              function(response) {
                $scope.shopItemContent = response.data;
                $log.info($scope.shopItemContent);
              },
              function(err) {
                $log.error(err);
              });
        }

        $scope.saveShopItem = function() {
          console.log("save shop item called")
          var files = document.getElementById('productImage').files;
          if(files.length > 0) {
            if(files[0].size <= 700000) {
              getBase64(files[0])
            } else {
              flashMessageService.setMessage("The file you supplied is over 700kb");
              return false;
            }
          }

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
        email: '',
        passwordPin: '',
        chatName: '',
        accountStatus: 'active',
    };

    $scope.userTypes = ['user', 'admin'];

    $scope.checkUsername = function() {
      $scope.newUser.username = $scope.newUser.email;

      UsernameCheckService.checkUsername($scope.newUser.username).then(
        function(res) {
          if(res.data !== 'false') {
            flashMessageService.setMessage("This user already exists");
          } else {
            if($scope.newUser.userType == '') {
              $scope.newUser.userType = 'user';
            }
            console.log($scope.newUser)
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
        if($scope.userType != "admin") {
          var newUserScope = $scope.$new();
          $controller('CentralLoginCtrl', {$scope : newUserScope});
          newUserScope.login($scope.newUser);
        } else {
          $location.path('/admin/user-list');
        }
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
            
            if(res.data.userType == "admin"  && res.data.accountStatus == "active") {
                $location.path('/admin/dashboard');
            } else if(res.data.userType == "user" && res.data.accountStatus == "active") {
                $location.path('/user/profile/'+ $cookies.get('loggedInUser'));
            } else if(res.data.accountStatus == "disabled") {
                $cookies.remove('loggedInUser', { path: '/' });
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
        }
      );
}])
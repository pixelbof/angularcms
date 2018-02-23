'use strict';
angular.module('myApp.services', [])
.factory('vodFactory', ['$http', '$location',
  function($http, $location) {
    var baseURL = "https://api.dacast.com";
    var apiKey = "76581_0ee0c375605f5763bf54";

    return {
      getAllVods: function() {
        return $http.get(baseURL + '/v2/vod?apikey='+ apiKey +'&_format=json');
      }
    };
  }
])

.factory('shopFactory', ['$http', '$location',
  function($http, $location) {
    return {
      getItems: function() {
        return $http.get('/api/shop/getItems');
      },
      getItemDetails: function(item) {
        return $http.get('/api/shop/getItems/'+item);
      },
      getBasket: function(user) {
        return $http.get('/api/shop/getItems/'+user);
      },
      getPaymentHistory: function(user) {
        return $http.get('/api/shop/getItems/'+user);
      },
      getPaymentHistoryDetails: function(paymentId) {
        return $http.get('/api/shop/getItems/'+paymentId);
      },
      addPaymentHistory: function(paymentDetails) {
        return $http.post('/api/shop/addPaymentHistory', paymentDetails);
        var id = paymentDetails._id;

        if (id == 0) {
          return $http.post('/api/shop/PaymentHistory/add', paymentDetails);
        } else {
          return $http.post('/api/shop/PaymentHistory/update', paymentDetails);
        }
      },
      makePayment: function(pspDetails) {
        return $http.post('psp api details', pspDetails);
      }
    }
  }
])

.factory('socialFactory', ['$http', '$location',
  function($http, $location) {

    return {
      getSocialMedia: function() {
        return $http.get('/api/socialMedia');
      },
      getSocialMediaContent: function(id) {
        return $http.get('/api/socialMedia/' + id);
      },
      saveSocialMedia: function(socialData) {
        var id = socialData._id;

        if (id == 0) {
          return $http.post('/api/socialMedia/add', socialData);
        } else {
          return $http.post('/api/socialMedia/update', socialData);
        }
      },
      deleteSocialMedia: function(id) {
        return $http.get('/api/socialMedia/delete/' + id);
      }
    };
  }
])

.factory('pagesFactory', ['$http', '$location',
  function($http, $location) {

    return {
      getPages: function() {
        return $http.get('/api/pages');
      },
      savePage: function(pageData) {
        var id = pageData._id;

        if (id == 0) {
          return $http.post('/api/pages/add', pageData);
        } else {
          return $http.post('/api/pages/update', pageData);
        }
      },
      deletePage: function(id) {
        return $http.get('/api/pages/delete/' + id);
      },
      getAdminPageContent: function(id) {
        return $http.get('/api/pages/admin-details/' + id);
      },
      getPageContent: function(url) {
        return $http.get('/api/pages/details/' + url);
      },
    };
  }
])

.factory('UserService', ['$http', 
  function($http) {
    return {
      checkAccountStatus: function(user) {
        return $http.get('/api/get-user-single/' + user)
      },
      getUsers: function(user) {
        return $http.get('/api/get-user');
      },
      deleteUser: function(id) {
        return $http.get('/api/delete-user/' + id);
      },
      disableUser: function(id) {
        return $http.post('/api/disable-user', {id: id});
      },
      enableUser: function(id) {
        return $http.post('/api/enable-user', {id: id});
      },
      getProfile: function(user) {
        return $http.get('/api/get-profile/'+ user)
      },
      getProfilePic:function(user) {
        return $http.get('/api/get-profile-pic/'+ user);
      },
      updateProfile: function(profileData) {
        if(profileData.lastUpdated == null) {
          return $http.post('/api/add-profile', profileData);
        } else {
          return $http.post('/api/update-user-profile', profileData);
        }
      }
    };
}])

.factory('UsernameCheckService', ['$http', 
  function($http) {
    return {
      checkUsername: function(user) {
        return $http.post('/api/username-check', {username: user});
      }
    };
}])

.factory('UserRegisterService', ['$http', 
  function($http) {
    return {
      addUser: function(details) {
        return $http.post('/api/add-user', details);
      }
    };
}])

.factory('AuthService', ['$http', function($http) {
  return {
    login: function(credentials) {
      return $http.post('/api/login', credentials);
    },
    logout: function() {
      return $http.get('/api/logout');
    }
  };
}])

.factory('myHttpInterceptor', ['$q', '$location', '$cookies', function($q, $location, $cookies) {
    return {
        response: function(response) {
            return response;
        },
        responseError: function(response) {
            if (response.status === 401) {
                $cookies.remove('loggedInUser', { path: '/' });
                $location.path('/admin/login');
                return $q.reject(response);
            }
            return $q.reject(response);
        }
    };
}]);
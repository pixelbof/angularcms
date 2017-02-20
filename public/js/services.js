'use strict';
angular.module('myApp.services', [])

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
      getUsers: function(user) {
        return $http.get('/api/get-user');
      },
      getProfile: function(user) {
        return $http.get('/api/get-profile/'+ user)
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
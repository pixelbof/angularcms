'use strict';
navigator.serviceWorker.getRegistrations().then(function(registrations) {
 for(let registration of registrations) {
  registration.unregister()
} })

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ngCookies',
  'message.flash'
]).
config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        //USER ROUTES
        $routeProvider.when('/live', {
            templateUrl: 'partials/live-stream.html',
            controller: 'liveStream'
        });
        $routeProvider.when('/user/register', {
            templateUrl: 'partials/user/register.html',
            controller: 'CentralRegisterCtrl'
        });
        $routeProvider.when('/user/profile/:user', {
            templateUrl: 'partials/user/profile.html',
            controller: 'UserProfileCtrl'
        });

        $routeProvider.when('/user/update-profile', {
            templateUrl: 'partials/user/update-profile.html',
            controller: 'UserUpdateProfileCtrl'
        });

        //ADMIN ROUTES
        $routeProvider.when('/admin/login', {
            templateUrl: 'partials/admin/login.html',
            controller: 'CentralLoginCtrl'
        });
        $routeProvider.when('/admin', {
           redirectTo: '/admin/login'
        });
        $routeProvider.when('/admin/dashboard', {
            templateUrl: 'partials/admin/dashboard.html',
            controller: 'AdminDashboardCtrl'
        });
        $routeProvider.when('/admin/user-list', {
            templateUrl: 'partials/admin/user-list.html',
            controller: 'AdminUserListCtrl'
        });
        $routeProvider.when('/admin/pages', {
            templateUrl: 'partials/admin/pages.html',
            controller: 'AdminPagesCtrl'
        });
        $routeProvider.when('/admin/add-edit-page/:id', {
            templateUrl: 'partials/admin/add-edit-page.html',
            controller: 'AddEditPageCtrl'
        });
        $routeProvider.when('/admin/logout', {
            templateUrl: 'partials/admin/login.html',
            controller: 'CentralLogoutCtrl' //central logout for all users
        });
        $routeProvider.when('/:url', {
            templateUrl: 'partials/page.html',
            controller: 'PageCtrl'
        });
        $routeProvider.otherwise({
            redirectTo: '/home'
        });
        $locationProvider.html5Mode(true);
    }
]).
config(function ($httpProvider) {
    $httpProvider.interceptors.push('myHttpInterceptor');
});
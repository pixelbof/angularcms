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
        $routeProvider.when('/admin', {
           redirectTo: '/admin/login'
        });
        $routeProvider.when('/live', {
            templateUrl: 'partials/live-stream.html',
            controller: 'liveStream'
        });
        $routeProvider.when('/:url', {
            templateUrl: 'partials/page.html',
            controller: 'PageCtrl'
        });
        $routeProvider.when('/admin/login', {
            templateUrl: 'partials/admin/login.html',
            controller: 'AdminLoginCtrl'
        });
        $routeProvider.when('/user/register', {
            templateUrl: 'partials/user/register.html',
            controller: 'UserRegisterCtrl'
        });
        $routeProvider.when('/admin/logout', {
            templateUrl: 'partials/admin/login.html',
            controller: 'AdminLogoutCtrl'
        });
        $routeProvider.when('/admin/pages', {
            templateUrl: 'partials/admin/pages.html',
            controller: 'AdminPagesCtrl'
        });
        $routeProvider.when('/admin/add-edit-page/:id', {
            templateUrl: 'partials/admin/add-edit-page.html',
            controller: 'AddEditPageCtrl'
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
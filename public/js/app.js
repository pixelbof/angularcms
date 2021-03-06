'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ui.tinymce',
  'ngCookies',
  'message.flash'
]).
config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        //USER ROUTES
        $routeProvider.when('/v-pods', {
            templateUrl: 'partials/v-pods.html',
            controller: 'v-pods'
        });
        $routeProvider.when('/shop', {
            templateUrl: 'partials/user/shop.html',
            controller: 'shopCtrl'
        });
        $routeProvider.when('/shop/checkout', {
            templateUrl: 'partials/user/checkout.html',
            controller: 'shopCheckoutCtrl'
        });
        $routeProvider.when('/shop/payment/success', {
            templateUrl: 'partials/user/payment-success.html',
            controller: 'shopPaymentSuccessCtrl'
        });
        $routeProvider.when('/shop/checkout', {
            templateUrl: 'partials/user/checkout.html',
            controller: 'shopCheckoutCtrl'
        });
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
        $routeProvider.when('/admin/shop-transactions', {
            templateUrl: 'partials/admin/shop-transactions.html',
            controller: 'AdminTransactionsCtrl'
        });
        $routeProvider.when('/admin/shop-display', {
            templateUrl: 'partials/admin/shop-display.html',
            controller: 'AdminShopDisplayCtrl'
        });
        $routeProvider.when('/admin/add-edit-shop/:id', {
            templateUrl: 'partials/admin/add-edit-shop.html',
            controller: 'AdminAddEditShopCtrl'
        });
        $routeProvider.when('/admin/user-profile/:user', {
            templateUrl: 'partials/admin/user-profile.html',
            controller: 'UserProfileCtrl'
        });
        $routeProvider.when('/admin/user-list', {
            templateUrl: 'partials/admin/user-list.html',
            controller: 'AdminUserListCtrl'
        });
        $routeProvider.when('/admin/add-user', {
            templateUrl: 'partials/admin/add-user.html',
            controller: 'CentralRegisterCtrl'
        });
        $routeProvider.when('/admin/pages', {
            templateUrl: 'partials/admin/pages.html',
            controller: 'AdminPagesCtrl'
        });
        $routeProvider.when('/admin/add-edit-page/:id', {
            templateUrl: 'partials/admin/add-edit-page.html',
            controller: 'AddEditPageCtrl'
        });
        $routeProvider.when('/admin/socialMedia', {
            templateUrl: 'partials/admin/social-media.html',
            controller: 'AdminSocialMediaCtrl'
        });
        $routeProvider.when('/admin/add-edit-social/:id', {
            templateUrl: 'partials/admin/add-edit-social.html',
            controller: 'AddEditSocialMediaCtrl'
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
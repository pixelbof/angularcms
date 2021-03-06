'use strict';

/* Filters */

angular.module('myApp.filters', [])
  .filter('formatURL', [
    function() {
      return function(input) {
        var url = input.replace(/[`~!@#$%^&*()_|+-=?;:'",.<>{}[]/gi, '');
        var url = url.replace(/[+]/g, '-');
        return url.toLowerCase();
      };
    }
  ])
  .filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);;
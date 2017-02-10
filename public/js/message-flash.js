angular.module('message.flash', [])
.factory('flashMessageService', ['$rootScope',function($rootScope) {
  var message = '';
  var type = '';
  return {
    getMessage: function() {
      return message;
    },
    getType: function() {
      return type;
    },
    setMessage: function(newMessage) {
        message=newMessage;
        $rootScope.$broadcast('NEW_MESSAGE')
    },
    setType: function(newType) {
        type=newType;
    }
  };
}]).

directive('messageFlash', [function() {
  return {
    controller: function($scope, flashMessageService, $timeout) {
      $scope.$on('NEW_MESSAGE', function() {
        $scope.message = flashMessageService.getMessage();
        $scope.type = flashMessageService.getType();
        $scope.isVisible = true;
        return $timeout(function() {
          $scope.isVisible = false;
          return $scope.message = '';
        }, 2500);
      })
    },
    template: '<p ng-if="isVisible" class="alert alert-warning">{{message}}</p>'
    }
  }
]);
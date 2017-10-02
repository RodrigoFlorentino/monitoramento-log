var app = angular.module('MinhaApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);

app.controller('userController', ['$window','$scope', '$log', '$http','$filter','$uibModal','$location', function($window,$scope, $log, $http,$filter,$uibModal,$location) {

   $scope.logar = function() {

          var config = {headers : {'Content-Type': 'application/json; charset=utf-8'}}
          var data = {
                       username: $scope.user,
                       password: $scope.password
                     };

         $http.post('/login', JSON.stringify(data) , config)
            .then(
                function(response){
                  if(response.status==200){
                     if(response.data.user.name!=''){
                       myRedirect("/listalogs", "access_token", response.data.token);
                     }
                  }
                },
                function(response){
                  // failure callback
                  console.log('Erro '+response);
                  $scope.errorMessage="Error : "+response.data.message;
                }
             );

   }

   myRedirect = function(redirectUrl, arg, value) {
         var form = $('<form action="' + redirectUrl + '" method="post">' +
         '<input type="text" name="'+ arg +'" value="' + value + '"></input>' + '</form>');
         $('body').append(form);
         $(form).submit();
   };

}]);


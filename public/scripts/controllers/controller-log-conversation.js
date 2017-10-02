
var app = angular.module('MinhaApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);

app.controller('myController', ['$scope', '$log', '$http','$filter','$uibModal','$window', function($scope, $log, $http,$filter,$uibModal,$window) {

            $scope.sortType     = 'name'; // set the default sort type
            $scope.sortReverse  = true;  // set the default sort order
            $scope.searchFish   = '';     // set the default search/filter term

            $scope.disableBtnTreinarIntencao = true;
            $scope.disableBtnTreinarEntidade = true;

            $scope.opcaoTreinamento = ["Sim", "Não"];
            $scope.tpTreinamento = ["Intenção", "Entidade"];
            $scope.prcConfianca = ["10", "20","30","40","50","60","70","80","90","100"];
            $scope.sinalMaiorMenor = ["<=", ">="];

            $scope.buscar = function() {

                $scope.loading = true;
                $http.get('/api/logconversation/treinamento').then(function(response) {
                   var retorno = [];
                   var data = response.data;
                   console.log('data '+data);
                    var pos = 0;

                    angular.forEach(data.docs, function(item){
                         var jsonParam = {};
                          angular.forEach(item.response.entities, function(ent){
                               jsonParam.entidade = ent.entity;
                               //jsonParam.confidenceEntidade = (ent.confidence*100).toFixed(1)+" %";
                               jsonParam.confidenceEntidade =parseFloat((ent.confidence*100).toFixed(2)) ;
                          });
                          angular.forEach(item.response.intents, function(int){
                             jsonParam.intencao = int.intent;
                            // jsonParam.confidenceIntencao = (int.confidence*100).toFixed(1) +" %";
                            jsonParam.confidenceIntencao = parseFloat((int.confidence*100).toFixed(2)) ;
                          });

                          angular.forEach(item.response.input, function(text){
                                     if(text.length!=0)jsonParam.msgUser = text;
                           });

                          if(item.response.context.conversation_id.length!=0){
                            jsonParam.conversation_id = item.response.context.conversation_id;
                            jsonParam.data = $filter('date')(item.response_timestamp, "dd/MM/yyyy HH:mm:ss");
                            jsonParam.id=item.log_id;
                            jsonParam.treinado=item.treinado;
                          }

                         if(!angular.equals(jsonParam, {})){
                            retorno.push(jsonParam);

                         }
                     });

                     if(retorno.length!=0){
                       retorno.push({selected: {}});
                     }

                      console.log('size data '+retorno.length);
                      $scope.items = retorno;
                      $scope.filteredItems = retorno;

                      if(retorno.length==0 ){
                            $scope.errorMessage='Registro não encontrado.';
                      } else {
                            $scope.errorMessage='';
                      }

                      $scope.loading = false;

                 });
             }


             $scope.logout = function() {
                   $window.location.href='/';
             }

             $scope.isNumber = angular.isNumber;

             $scope.sort_by = function(newSortingOrder) {
                   $scope.sortReverse = ($scope.sortType === newSortingOrder) ? !$scope.sortReverse : false;
                   $scope.sortType = newSortingOrder;

             };

             $scope.showDown = function(newSortingOrder) {
                  return $scope.sortType == newSortingOrder && !$scope.sortReverse
             };

             $scope.showUp = function(newSortingOrder) {
                  return $scope.sortType == newSortingOrder && $scope.sortReverse
             };

             $scope.selection = [];

             // Toggle selection
             $scope.toggleSelection = function (id) {

                   var idx = $scope.selection.indexOf(id);
                   // Is currently selected
                   if (idx > -1) {
                     $scope.selection.splice(idx, 1);
                   } // Is newly selected
                   else {
                     $scope.selection.push(id);
                   }

                   if($scope.selection.length>0){
                     $scope.disableBtnTreinarIntencao = false;
                     $scope.disableBtnTreinarEntidade = false;

                   } else {
                      $scope.disableBtnTreinarIntencao = true;
                      $scope.disableBtnTreinarEntidade = true;
                   }
             };

            $scope.aplicar = function () {
                 angular.forEach($scope.selection, function(sel){
                      console.log('checksboxx'+sel)
                  });
             };

            var $ctrl = this;
            $scope.modalEntidade = function(size,param) {
                     $scope.parametro=param;
                     $uibModal.open({
                         scope: $scope,
                         animation: true,
                         controllerAs: '$ctrl',
                         // Esse vai exibir o nome do scope atual
                         templateUrl: 'myModalEntidade.html',
                         controller: 'ModalInstanceCtrl',
                         windowClass: 'custom-dialog',
                         backdrop:false,
                         size: size,
                     });
             };


             $scope.modalIntencao = function(size,param) {
                       $scope.parametro=param;
                          $uibModal.open({
                              scope: $scope,
                              animation: true,
                              controllerAs: '$ctrl',
                              // Esse vai exibir o nome do scope atual
                              templateUrl: 'myModalIntencao.html',
                              controller: 'ModalInstanceCtrl',
                              windowClass: 'custom-dialog',
                              backdrop:false,
                              size: size,
                          });
              };

               $scope.modalConfigWorkspace = function(size,param) {
                                     $scope.parametro=param;
                                        $uibModal.open({
                                            scope: $scope,
                                            animation: true,
                                            controllerAs: '$ctrl',
                                            // Esse vai exibir o nome do scope atual
                                            templateUrl: 'myModalAdmWorkspace.html',
                                            controller: 'ModalInstanceCtrl',
                                            windowClass: 'custom-dialog',
                                            backdrop:false,
                                            size: size,
                                        });
                };


                $scope.modalCriarWorkspace = function(size,param) {
                             $scope.parametro=param;
                                $uibModal.open({
                                    scope: $scope,
                                    animation: true,
                                    controllerAs: '$ctrl',
                                    // Esse vai exibir o nome do scope atual
                                    templateUrl: 'myModalConfigWorkspace.html',
                                    controller: 'ModalInstanceCtrl',
                                    windowClass: 'custom-dialog',
                                    backdrop:false,
                                    size: size,
                                });
                 };

                 $scope.inicializa = function(){
                     //$scope.usuariologado = "Rafaeil";
                     $http.get('/api/getUserAutenticado').then(function(response) {
                          var data = response.data;
                          $scope.usuariologado = data.username;
                     });

                 };


}]);


app.filter('filterTreinamento', function() {
    return function( items, treinado ) {
      var filtered = [];
      var condicao =  treinado == 'Sim' ? true  : false;

      if(!treinado){//se treinado is undifenid
         angular.forEach(items, function(item) {
                   filtered.push(item);
          });
         return filtered;
      }
      angular.forEach(items, function(item) {
        if( condicao == item.treinado ) {
          filtered.push(item);
        }
      });
      return filtered;
    };
});


app.filter('filterConfianca', function() {
    return function( items, sinal , porcentagem , tpTreinamento ) {
      var filtered = [];

      if(!sinal || !porcentagem || !tpTreinamento ){
           angular.forEach(items, function(item) {

                      filtered.push(item);
           });
           return filtered;

      }

      if(tpTreinamento=='Entidade'){
         if(sinal=='<='){
            angular.forEach(items, function(item) {
                if( item.confidenceEntidade <= porcentagem  ) {
                  filtered.push(item);
                }
             });
            return filtered;
         }
         else if (sinal=='>='){
            angular.forEach(items, function(item) {
                if(item.confidenceEntidade >= porcentagem ) {
                  filtered.push(item);
                }
             });
            return filtered;
         }

       } else if(tpTreinamento =='Intenção'){
              if(sinal=='<='){
                 angular.forEach(items, function(item) {
                     if( item.confidenceIntencao <= porcentagem  ) {
                       filtered.push(item);
                     }
                  });
                 return filtered;
              }
              else if (sinal=='>='){
                 angular.forEach(items, function(item) {
                     if(item.confidenceIntencao >= porcentagem ) {
                       filtered.push(item);
                     }
                  });
                 return filtered;
              }
       }

    };
});




app.controller('ModalInstanceCtrl', ['$scope','$uibModalInstance','$http',function ($scope, $uibModalInstance,$http) {
        var $ctrl = this;
        $ctrl.defineVlrSin = 'Valor';
        limpar();

        function limpar() {
           $ctrl.errorMessage='';
           $ctrl.sucessoMessage='';
        }

        $ctrl.ok = function() {
                limpar();
                //$uibModalInstance.close($scope.selected.item);
                if($scope.parametro=='intencao'){
                   if($scope.selection.length==0){
                     $ctrl.errorMessage="Selecione na tabela algum registro.";
                   }else{
                    angular.forEach($scope.selection, function(sel){
                        console.log('checksboxx'+sel);
                        angular.forEach($scope.items, function(item){
                              if(item.id==sel){
                                console.log('Msg User'+item.msgUser );
                                console.log('selected '+$scope.selectedIntencao );

                                var config = {headers : {'Content-Type': 'application/json; charset=utf-8'}}
                                var data = {
                                              intencao: $scope.selectedIntencao ,
                                              message: item.msgUser
                                            };

                                $http.post('/api/logconversation/intencao', JSON.stringify(data) , config)
                                   .then(
                                       function(response){
                                         // success callback
                                         console.log('Sucesso '+response);
                                         if(response.status==200){
                                            if(response.data.error){
                                                $ctrl.errorMessage=""+response.data.error;
                                            }else {
                                                $ctrl.sucessoMessage="Intenção associada com sucesso.";
                                                var data1 = { idLog:sel };
                                                $http.post('/api/logconversation/treinamento/status', JSON.stringify(data1) , config)
                                                .then(function(response){
                                                        console.log('Sucesso '+response);
                                                        if(response.status==201){
                                                          $scope.buscar();
                                                        }

                                                 },
                                                   function(response){
                                                      console.log('Erro '+response);
                                                 });
                                            }
                                         }
                                       },
                                       function(response){
                                         // failure callback
                                         console.log('Erro '+response);
                                         $ctrl.errorMessage="Error"+response;
                                       }
                                    );

                              }//fim do if
                         });
                     });
                   }//fim do else
                }

                if($scope.parametro=='entidade'){

                           if($scope.selection.length==0){
                             $ctrl.errorMessage="Selecione na tabela algum registro.";
                           }else{
                            angular.forEach($scope.selection, function(sel){
                                angular.forEach($scope.items, function(item){
                                      if(item.id == sel){
                                        var config = {headers : {'Content-Type': 'application/json; charset=utf-8'}}
                                        if($ctrl.defineVlrSin=='Sinonimo'){
                                           var data = {
                                                         entidade: $scope.selectedEntidade ,
                                                         valor: $ctrl.selectedEntidadeValue,
                                                         sinonimo: item.msgUser,
                                                         idLog:sel };

                                              $http.post('/api/logconversation/entidade/synonyms', JSON.stringify(data) , config)
                                                .then(
                                                    function(response){
                                                      // success callback
                                                      console.log('Sucesso '+response);
                                                      if(response.status==200){
                                                         if(response.data.error){
                                                             $ctrl.errorMessage=""+response.data.error;
                                                         }else {
                                                             $ctrl.sucessoMessage="Sinonimo criado com sucesso.";
                                                              var data1 = { idLog:sel };
                                                              $http.post('/api/logconversation/treinamento/status', JSON.stringify(data1) , config)
                                                              .then(function(response){
                                                                      console.log('Sucesso '+response);
                                                                      if(response.status==201){
                                                                        $scope.buscar();
                                                                      }

                                                                },
                                                                 function(response){
                                                                    console.log('Erro '+response);
                                                                });

                                                         }
                                                      }
                                                    },
                                                    function(response){
                                                      // failure callback
                                                      console.log('Erro '+response);
                                                      $ctrl.errorMessage="Error"+response;
                                                    }
                                                 );

                                         } else {

                                             var data = {
                                                  entidade: $scope.selectedEntidade ,
                                                  valor: item.msgUser,
                                                  id:sel  };

                                             $http.post('/api/logconversation/entidade', JSON.stringify(data) , config)
                                                 .then(
                                                     function(response){
                                                       // success callback
                                                       console.log('Sucesso '+response);
                                                       if(response.status==200){
                                                          if(response.data.error){
                                                              $ctrl.errorMessage=""+response.data.error;
                                                          }else {
                                                              $ctrl.sucessoMessage="Valor da Entidade criado com sucesso.";
                                                               var data1 = { idLog:sel };
                                                                $http.post('/api/logconversation/treinamento/status', JSON.stringify(data1) , config)
                                                                .then(function(response){
                                                                        console.log('Sucesso '+response);
                                                                         if(response.status==201){
                                                                            $scope.buscar();
                                                                          }

                                                                 },
                                                                   function(response){
                                                                      console.log('Erro '+response);
                                                                 });
                                                          }
                                                       }
                                                     },
                                                     function(response){
                                                       // failure callback
                                                       console.log('Erro '+response);
                                                       $ctrl.errorMessage="Error"+response;
                                                     }
                                                  );


                                        }


                                      }//fim do if
                                 });
                             });
                           }//fim do else
                        }


            };

        $ctrl.cancel = function() {
            // $uibModalInstance.dismiss('cancel');
             $uibModalInstance.close(false);
             limpar();
        };

        if($scope.parametro=='entidade'){
            try {
                  angular.forEach($scope.selection, function(sel){
                         angular.forEach($scope.items, function(item){
                               if(item.id==sel){
                                 $ctrl.mensagemEntidade=item.msgUser;
                                 throw Error();//usado para simular o break, pra não iterar toda lista quando encontrado
                               }//fim do if
                          });
                  });

              } catch(e) {
                  // anything
              }

            limpar();
            $http.get('/api/logconversation/entities').then(function(response) {
                var retorno = [];
                var data = response.data;
                var x=0;
                angular.forEach(data.entities, function(ent){
                   var jsonParam = {}
                   jsonParam.id=++x;
                   jsonParam.descricao=ent.entity;
                   retorno.push(jsonParam);
                });

                $ctrl.entidades = retorno;

            });
       } else if ($scope.parametro=='intencao'){

             try {
                   angular.forEach($scope.selection, function(sel){
                          angular.forEach($scope.items, function(item){
                                if(item.id==sel){
                                  $ctrl.mensagemIntencao=item.msgUser;
                                  throw Error();//usado para simular o break, pra não iterar toda lista quando encontrado
                                }//fim do if
                           });
                   });

               } catch(e) {
                   // anything
               }
              limpar();
             $http.get('/api/logconversation/intencoes').then(function(response) {
                var retorno = [];
                var data = response.data;
                var x=0;
                angular.forEach(data.intents, function(int){
                   var jsonParam = {}
                   jsonParam.id=++x;
                   jsonParam.descricao=int.intent;
                   retorno.push(jsonParam);
                });

                $ctrl.intencoes = retorno;
            });
       }
       //funcão quando modificado o select da entidade
       $ctrl.onchangeEntidade= function() {
             limpar();
             console.log("change entidade");
              var entidade= $scope.selectedEntidade;
             if($ctrl.defineVlrSin=='Sinonimo'){
                 $http.get('/api/logconversation/entidade/value/'+entidade).then(function(response) {
                        var retorno = [];
                        var data = response.data;
                        var x=0;
                        angular.forEach(data.values, function(val){
                           var jsonParam = {}
                           jsonParam.id=++x;
                           jsonParam.descricao=val.value;
                           retorno.push(jsonParam);
                        });

                         $ctrl.EntidadeValues = retorno;
                  });
            }//fim do if

       };

       //funcão quando modificado o radio definir valor/sinonimo
       $ctrl.onchangeRadioEnt= function() {
          limpar();
          if($ctrl.defineVlrSin=='Sinonimo'){
            $scope.selectedEntidade ="";
            $ctrl.selectedEntidadeValue="";
          }
       };


       if ($scope.parametro=='configworkspace'){
          limpar();
           $http.get('/api/logconversation/workspace').then(function(response) {
                  var retorno = [];
                  var data = response.data;
                  angular.forEach(data.docs, function(val){
                     var jsonParam = {}
                     jsonParam.id=val._id
                     jsonParam.nome=val.nome;
                     jsonParam.workspaceId=val.workspaceId;
                     jsonParam.username=val.username;
                     jsonParam.password=val.password;
                     retorno.push(jsonParam);
                  });

                   $ctrl.workspacesValues = retorno;
              });
       }


       $ctrl.onchangeWorkspace = function() {
          try {

               angular.forEach($ctrl.workspacesValues, function(item){
                     if(item.id==$scope.selectedWorkspace){
                        $ctrl.itemWorksapceSelected=item;
                       throw Error();//usado para simular o break, pra não iterar toda lista quando encontrado
                     }//fim do if
                });

            } catch(e) {
                // anything
            }
       }

       $ctrl.saveWorkspace = function() {

            var config = {headers : {'Content-Type': 'application/json; charset=utf-8'}};

            var data = {
                     workspaceId: $scope.workspaceId ,
                     username: $scope.username ,
                     password: $scope.password,
                     nome: $scope.nome};

                $http.post('/api/logconversation/workspace', JSON.stringify(data) , config)
                    .then(
                        function(response){
                          // success callback
                          console.log('Sucesso '+response);
                          if(response.status==201){
                             if(response.data.error){
                                 $ctrl.errorMessage=""+response.data.error;
                             }else {
                                 $ctrl.sucessoMessage="workspace criado com sucesso.";
                             }
                          }
                        },
                        function(response){
                          // failure callback
                          console.log('Erro '+response);
                          $ctrl.errorMessage="Error"+response;
                        }
                     );

       }


       $ctrl.configureWorkspace = function() {

                       var config = {headers : {'Content-Type': 'application/json; charset=utf-8'}};
                       console.log('/api/logconversation/workspace/'+$scope.selectedWorkspace);
                       $http.put('/api/logconversation/workspace/'+$scope.selectedWorkspace, config)
                           .then(
                               function(response){
                                 // success callback
                                 console.log('Sucesso '+response);
                                 if(response.status==200){
                                    if(response.data.error){
                                        $ctrl.errorMessage=""+response.data.error;
                                    }else {
                                        $ctrl.sucessoMessage="workspace configurado com sucesso.";
                                    }
                                 }
                               },
                               function(response){
                                 // failure callback
                                 console.log('Erro '+response);
                                 $ctrl.errorMessage="Error"+response;
                               }
                            );

              }



}]);
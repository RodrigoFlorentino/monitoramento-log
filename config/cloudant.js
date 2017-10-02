
  var Cloudant = require('cloudant');
  var express = require('express');
  var fs = require('fs');
  var request=require('request');
  var http = require("http");
  var app = express();
  app.set('port', process.env.PORT || 2000);
  var protocol = process.env.NODE_ENV == 'production' ? "https" : "http" ;

    var cloudant_url="https://b6a29beb-91ed-4256-81c4-458e3ff55a71-bluemix:2cd1080e5c8ac457d9cbc3105aabfa7f28abfe45e03cae99eaa5910dbc84ab6a@b6a29beb-91ed-4256-81c4-458e3ff55a71-bluemix.cloudant.com";
    var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
    var user = 'b6a29beb-91ed-4256-81c4-458e3ff55a71-bluemix'; // Set this to your own account
    var password = '2cd1080e5c8ac457d9cbc3105aabfa7f28abfe45e03cae99eaa5910dbc84ab6a';

    if(process.env.VCAP_SERVICES)
    {
    	services = JSON.parse(process.env.VCAP_SERVICES);
    	if(services.cloudantNoSQLDB) //Check if cloudantNoSQLDB service is bound to your project
    	{
    		cloudant_url = services.cloudantNoSQLDB[0].credentials.url;  //Get URL and other paramters
    		user = services.cloudantNoSQLDB[0].credentials.username;
    		password = services.cloudantNoSQLDB[0].credentials.password;
    		//console.log("Name = " + services.cloudantNoSQLDB[0].name);
    		//console.log("URL = " + services.cloudantNoSQLDB[0].credentials.url);
            //console.log("username = " + services.cloudantNoSQLDB[0].credentials.username);
    		//console.log("password = " + services.cloudantNoSQLDB[0].credentials.password);
    	}
    }

    //Connect using cloudant npm and URL obtained from previous step

    //Edit this variable value to change name of database.
    var dbname = 'bdviacognitiva';

    // Initialize the library with my account.
    var cloudantDB = Cloudant({url: cloudant_url,account:user,password:password});
    db = cloudantDB.db.use(dbname);

    var cloudant = {
        get : function(req, res) {
         var id = req.params.id;
         console.log('id ='+id);
              db.get(id, function(err, data) {
                   res.status(200).json(data);
               });
      }, insertLogs : function (req, res) {
          // insert a log document in it.
        //  console.dir(req);
          // var dataNow = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
           var dataNow = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});

           if(req.body.aplicacao=='abrale'){
              db = cloudantDB.db.use('log-abrale');
           }
           else if(req.body.aplicacao=='showlivre'){
               db = cloudantDB.db.use('log-showlivre');
           }

           db.insert({ conversation_id: req.body.conversation_id, messageWatson: req.body.messageWatson,messageUser:req.body.messageUser,intencao:req.body.intencao, data : dataNow }, 'doc_'+req.body.conversation_id+'_'+new Date().getTime(), function(err, body, header) {
              if (err) {
                  return console.log('[db.insert] ', err.message);
              }
                console.log('Documents is inserted');
                //console.log(body);
                res.status(201).json(body);
            });
      }, insertWorkspace : function (req, res) {

         db = cloudantDB.db.use('workspace');

         db.insert({nome:req.body.nome, workspaceId: req.body.workspaceId, username: req.body.username, password: req.body.password, status:'ativo',selecionado: 'false' } , function(err, body, header) {
               if (err) {
                   return console.log('[db.insert] ', err.message);
               }
                 console.log('insertWorkspace - Documents is inserted');
                 //console.log(body);
                 res.status(201).json(body);
          });
      }, listWorkspace : function (req, res) {

              db = cloudantDB.db.use('workspace');
              db.index( {name:'_id', type:'json', index:{fields:['status']}});

              var query = { selector: { status: 'ativo' }};
              db.find(query, function(err, data) {
                  if (err) {
                         return console.log('[db.listWorkspace] ', err.message);
                     }
                       //console.log(body);
                       res.status(201).json(data);


              });

        },
        getWorkspaceSelecionada : function (req, res) {

              db = cloudantDB.db.use('workspace');
              db.index( {name:'_id', type:'json', index:{fields:['selecionado']}});

              var query = { selector: { selecionado: 'true' }};
              db.find(query, function(err, data) {
                  if (err) {
                      return console.log('[db.getWorkspaceSelected ] ', err.message);
                    }
                   res.status(201).json(data);

              });

         },
         updateSelectWorkspace: function (req, res) {

                db = cloudantDB.db.use('workspace');
                db.index( {name:'_id', type:'json', index:{fields:['status']}});

                var query = { selector: { status: 'ativo' }};
                db.find(query, function(err, data) {
                   if (err) {
                          return console.log('[db.updateSelectWorkspace] ', err.message);
                      }
                      var condicao = false;
                      for(var i = 0; i < data.docs.length;i++){
                             if(data.docs[i]._id==req.params.id){
                                  data.docs[i].selecionado='true';
                                  db.insert(data.docs[i], function(err, data) {
                                          if (err) return console.log(err.message);
                                              console.log('update completed: ' + data);
                                              res.status(200).json(data)
                                  });
                             }else {
                                if(data.docs[i].selecionado=='true'){
                                     data.docs[i].selecionado='false';
                                     db.insert(data.docs[i], function(err, data) {
                                             if (err) return console.log(err.message);
                                                 console.log('update completed: ' + data);
                                     });

                                }

                             }
                      }

               });


         },

         login: function (req, res , callback) {
             db = cloudantDB.db.use('usuario');
             var query = { selector: { nome: req.body.username , senha: req.body.password}};
              db.find(query, function(err, data) {
                 if (err) {
                        return console.log('error ao buscar usuario login] ', err.message);
                  }
                  callback(data);
             });
         },

         insertLogTreinamento : function (callback) {


            console.log("insertLogTreinamento");

            var fullUrl = protocol + "://localhost:"+app.get('port')+"/api/logconversation/";

            console.log(fullUrl);

           request.get(fullUrl,function(err,resp,body){

                  if(err){
                     console.log(" insertLogTreinamento : "+JSON.parse(body));
                  }

                  var dataLog = JSON.parse(body);

                  console.log(dataLog.logs.length);

                  db = cloudantDB.db.use('log-treinamento-abrale');

                  for(var i = 0; i < dataLog.logs.length;i++){
                      dataLog.logs[i]._id=dataLog.logs[i].request_timestamp+"_"+dataLog.logs[i].request.input.text;
                      dataLog.logs[i].treinado=false;
                      dataLog.logs[i].ativo=true;
                  }
                  // operations(update/delete/insert) on the database em batch
                  db.bulk({docs:dataLog.logs}, function(err, body) {
                    console.log(body);
                  });

           });


         },
         getLogTreinamento: function (req, res){
              db = cloudantDB.db.use('log-treinamento-abrale');

              db.index( {name:'_id', type:'json', index:{fields:['ativo']}});

              var query = { selector: { ativo: true }};
              db.find(query, function(err, data) {
                    if (err) {
                           return console.log('[db.getLogTreinamento] ', err.message);
                       }
                         //console.log(body);
                  res.status(201).json(data);


              });
         },
         atualizaStatusTreinamento: function (req, res){
                db = cloudantDB.db.use('log-treinamento-abrale');
                const id =  req.body.idLog;
                db.index( {log_id: 'log_id', type:'json', index:{fields:['log_id']}});
                var query = { selector: { log_id: id }};
                db.find(query, function(err, data) {
                     if (err) {
                           return console.log('[db.atualizaStatusTreinamento] ', err.message);
                       }

                     data.docs[0].treinado=true;
                     db.insert(data.docs[0], function(err, data) {
                          if (err) return console.log(err.message);
                           console.log('update completed: ' + data);
                           res.status(201).json(data);
                      });

               });

         }
    };


module.exports = cloudant;


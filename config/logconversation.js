var request=require('request');
var express = require('express');
var app = express();
app.set('port', process.env.PORT || 2000);

var workspacesId =  '7f576bfc-2d11-4de2-b985-98e8185e5664';
var username = 'd1df6c26-bedc-4965-9a79-e1339c0cff80';
var password = '3lUqPxo4kNm2';
var apiHostname = 'gateway.watsonplatform.net';
var protocol = process.env.NODE_ENV == 'production' ? "https" : "http" ;

function mymodule_init(callback){
      var fullUrl = protocol + "://localhost:"+app.get('port')+"/api/logconversation/workspace/selecionado";
        console.log("fullUrl "+fullUrl);
        console.log("ambiente "+process.env.NODE_ENV );
       request.get(fullUrl,function(err,resp,body){
        //   console.log("inicializando .."+body);

           if (typeof body != 'undefined') {
             var obj = JSON.parse(body);
              console.log(obj);
              workspacesId = obj.docs[0].workspaceId;
              username = obj.docs[0].username;
              password = obj.docs[0].password;

           }
           callback(null);
        });
}

// Run my init:
mymodule_init(function(){});


 var logConversation = {
     get : function(req, res) {

      // mymodule_init(function(){

        console.log("Buscando log");
       // const workspacesId =  '7f576bfc-2d11-4de2-b985-98e8185e5664';
        const baseQuery = `/conversation/api/v1/workspaces/${workspacesId}/logs`;
        const version = 'version=2017-05-26';

        const fullUrl = `https://${username}:${password}@${apiHostname}${baseQuery}?${version}`;
        console.log(fullUrl);

       request.get(fullUrl,function(err,resp,body){
              if(err){
                 console.log(" logConversation.get Error: "+JSON.parse(body));
              }
              //res.status(200).json(JSON.parse(body));
              res.status(200).json(JSON.parse(body));

        });

       // });

  },
  getEntidades : function(req, res) {

             const baseQuery = `/conversation/api/v1/workspaces/${workspacesId}/entities`;
             const version = 'version=2017-05-26&export=false&include_count=false';

             const fullUrl = `https://${username}:${password}@${apiHostname}${baseQuery}?${version}`;
             console.log(fullUrl);

            request.get(fullUrl,function(err,resp,body){
                   if(err){
                      console.log(" logConversation.getEntidades Error: "+JSON.parse(body));
                   }
                   //res.status(200).json(JSON.parse(body));
                   res.status(200).json(JSON.parse(body));

           });

  },
  getIntencoes : function(req, res) {

               const baseQuery = `/conversation/api/v1/workspaces/${workspacesId}/intents`;
               const version = 'version=2017-05-26&export=false&include_count=false';

               const fullUrl = `https://${username}:${password}@${apiHostname}${baseQuery}?${version}`;
               console.log(fullUrl);
               request.get(fullUrl,function(err,resp,body){
                     if(err){
                        console.log(" logConversation.getIntencoes Error: "+JSON.parse(body));
                     }
                     //res.status(200).json(JSON.parse(body));
                     res.status(200).json(JSON.parse(body));

             });
    },
    treinaIntencao : function(req, res) {
          const intent =  req.body.intencao;
          const baseQuery = `/conversation/api/v1/workspaces/${workspacesId}/intents/${intent}/examples`;
          const version = 'version=2017-05-26';

          const fullUrl = `https://${username}:${password}@${apiHostname}${baseQuery}?${version}`;
          console.log(fullUrl);

          console.log("id do treina intencao "+req.body.id);

          request.post({
              headers: { "Content-Type": "application/json"},
              url:     fullUrl,
              body:  { "text":req.body.message},
              json:true
          }, function(err,resp,body){
                  if(err){
                      console.log(" logConversation.treinaIntencao Error: "+body);
                   }
                 res.status(200).json(body);
                // res.status(200).json(JSON.parse(body));
          });
    },
    treinaEntidade : function(req, res) {

          const entity =  req.body.entidade;
          const baseQuery = `/conversation/api/v1/workspaces/${workspacesId}/entities/${entity}/values`;
          const version = 'version=2017-05-26';

          const fullUrl = `https://${username}:${password}@${apiHostname}${baseQuery}?${version}`;
          console.log(fullUrl);

          console.log("id do treina entidade "+req.body.id);

          request.post({
              headers: { "Content-Type": "application/json"},
              url:     fullUrl,
              body:  {"value": req.body.valor,
                      "metadata": {},
                     },
              json:true
          }, function(err,resp,body){
                  if(err){
                      console.log(" logConversation.treinaIntencao Error: "+body);
                   }
                 res.status(200).json(body);
                // res.status(200).json(JSON.parse(body));
          });
    },
     getEntidadeValue : function(req, res) {

           const entity=req.params.entity;
            const baseQuery = `/conversation/api/v1/workspaces/${workspacesId}/entities/${entity}/values`;
            const version = 'version=2017-05-26&export=false&include_count=false';

            const fullUrl = `https://${username}:${password}@${apiHostname}${baseQuery}?${version}`;
            console.log(fullUrl);
            request.get(fullUrl,function(err,resp,body){
                  if(err){
                     console.log(" logConversation.getEntidadeValue Error: "+JSON.parse(body));
                  }
                //  res.status(200).json(body);
                   res.status(200).json(JSON.parse(body));

          });

     },
     criarSinonimo : function(req, res) {

             const entity =  req.body.entidade;
             const value =  req.body.valor;

             const baseQuery = `/conversation/api/v1/workspaces/${workspacesId}/entities/${entity}/values/${value}/synonyms`;
             const version = 'version=2017-05-26';

             const fullUrl = `https://${username}:${password}@${apiHostname}${baseQuery}?${version}`;
             console.log(fullUrl);

             request.post({
                 headers: { "Content-Type": "application/json"},
                 url:     fullUrl,
                 body:  {"synonym": req.body.sinonimo
                        },
                 json:true
             }, function(err,resp,body){
                     if(err){
                         console.log(" logConversation.criarSinonimoo Error: "+body);
                      }
                    res.status(200).json(body);
                   // res.status(200).json(JSON.parse(body));
             });
     }

}


module.exports = logConversation;
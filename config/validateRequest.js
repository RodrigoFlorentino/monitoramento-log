var jwt = require('jwt-simple');
var validateUser = require('../routes/auth.js').validateUser;


var validateRequest = {
     valida : function(req, res ) {

                var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'] ;

                console.log("Usuario na sessão "+req.session.usuario);

                if(req.session.usuario){
                   res.render(req.body.url)
                   return;
                }
                else if (token) {
                          try {
                            var decoded = jwt.decode(token, require('./secret.js')());
                            console.log("decoded.exp"+decoded.exp+", Date.now() "+Date.now());
                            if (decoded.exp <= Date.now()) {
                              res.statusCode=400;
                              res.setHeader('Content-Type', 'application/json');
                              res.json({
                                "status": 400,
                                "message": "Token Expired"
                              });
                            }

                            res.render(req.body.url)
                            return;


                          } catch (err) {
                            res.statusCode=500;
                            res.json({
                              "status": 500,
                              "message": "Invalid Token or Key"
                            });
                            console.log(err);
                          }
                 } else {
                      res.statusCode=401;
                      res.json({
                        "status": 401,
                        "message": "Invalid Token or Key"
                      });

                }

            }

}

module.exports = validateRequest;
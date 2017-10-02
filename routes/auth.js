var jwt = require('jwt-simple');

var cloudant = require('../config/cloudant.js');

var auth = {

  login: function(req, res) {

  console.log("SESSAO ="+req.session);

    var username = req.body.username || '';
    var password = req.body.password || '';

    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Entre com o Email e Password."
      });
      return;
    }

    // Fire a query to your DB and check if the credentials are valid
    auth.validate(req, res , function(dbUserObj) {

        if (!dbUserObj) { // If authentication fails, we send a 401 back
              res.status(401);
              res.json({
                "status": 401,
                "message": "Credencial Inválida."
              });
              return;
         }

         if (dbUserObj) {
              res.json(genToken(dbUserObj));
          }


    });

  },

  validate: function(req, res , callback ) {
    // spoofing the DB response for simplicity
    /*var dbUserObj = { // spoofing a userobject from the DB.
      name: 'robekson',
      role: 'admin',
      username: 'robekson@gmail.com'
    };*/
        var dbUserObj;
        cloudant.login(req,res, function(data) {

         if (data.docs.length!=0 && req.body.username == data.docs[0].nome && req.body.password == data.docs[0].senha ){
                dbUserObj = { // spoofing a userobject from the DB.
                      name: data.docs[0].nome,
                      role: 'admin',
                      username: data.docs[0].nome
                 };
                 req.session.usuario = dbUserObj;
                 callback(dbUserObj);
           } else {
                 callback(dbUserObj);
           }

     });


  },

  validateUser: function(username) {
    // spoofing the DB response for simplicity
    var dbUserObj = { // spoofing a userobject from the DB.
      name: 'robekson',
      role: 'admin',
      username: 'robekson@gmail.com'
    };

    return dbUserObj;
  },
}

// private method
function genToken(user) {
  //var expires = expiresIn(7); // 7 days
  var expires = expiresSeg(60);
  var token = jwt.encode({
    exp: expires
  }, require('../config/secret')());

  return {
    token: token,
    expires: expires,
    user: user
  };
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

function expiresSeg(segundos) {
  var dateObj = new Date();
  return dateObj.setSeconds(segundos);
}


module.exports = auth;
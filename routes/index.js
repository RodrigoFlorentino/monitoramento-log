
/*
 * GET home page.
 */

var validateRequest = require('../config/validateRequest.js');

module.exports = {
    index: function(req,res){
        res.render('index.html');
    },
    login : function(req,res){
        res.render('login.html');
    },
    listalogs : function(req,res){
        req.body.url = 'listalogs.html';
        validateRequest.valida(req,res);
     }
}


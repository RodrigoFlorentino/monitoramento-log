/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes/index.js'),
    http = require('http'),
    path = require('path'),
    fs = require('fs');
var cfenv = require('cfenv');

var session = require('express-session');
var cookieParser = require('cookie-parser');

var cloudant = require('./config/cloudant.js');

var logconversation = require('./config/logconversation.js');

var auth = require('./routes/auth.js');

var validateRequest = require('./config/validateRequest.js');

var schedule = require('node-schedule');


var app = express();

var fileToUpload;

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');

// all environments
app.set('port', process.env.PORT || 2000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}


app.use(cookieParser());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))

var job = schedule.scheduleJob('00 23 * * *', function(){
  console.log('Rodando Job Carga Log Treinamento..');
  cloudant.insertLogTreinamento(function() {});
});

app.get('/', routes.login);

app.post('/login', auth.login);

app.post('/listalogs', routes.listalogs);

//http://localhost:9000/api/cloudant/viacognitiva
app.get('/api/cloudant/:id', function (req, res) {
    cloudant.get(req, res);
});

app.get('/api/logconversation', function (req, res) {
    logconversation.get(req, res);
});

app.post('/api/logconversation/treinamento/status', function (req, res) {
    cloudant.atualizaStatusTreinamento(req, res);
});

app.get('/api/logconversation/treinamento', function (req, res) {
    console.log('Buscando ->  treinamento');
    cloudant.getLogTreinamento(req, res);
});


app.get('/api/getUserAutenticado', function (req, res) {
  if (typeof req.session.usuario != 'undefined'){
      res.status(200).json(req.session.usuario);
  }else {
      res.status(200).json({"message":"usuário não encontrado na sessão"});
  }
});

app.get('/api/logconversation/entities', function (req, res) {
    logconversation.getEntidades(req, res);
});

app.get('/api/logconversation/intencoes', function (req, res) {
    logconversation.getIntencoes(req, res);
});

app.post('/api/logconversation/intencao', function (req, res) {
    logconversation.treinaIntencao(req, res);
});

app.post('/api/logconversation/entidade', function (req, res) {
    logconversation.treinaEntidade(req, res);
});

app.post('/api/logconversation/entidade/synonyms', function (req, res) {
    logconversation.criarSinonimo(req, res);
});

app.get('/api/logconversation/entidade/value/:entity', function (req, res) {
    console.dir(req);
    logconversation.getEntidadeValue(req, res);
});

app.post('/api/logs', function (req, res) {
    console.log("Chamando serviço insert no cloudant ");
    cloudant.insertLogs(req, res);
});

app.post('/api/logconversation/workspace', function (req, res) {
    console.log("Chamando serviço insert no cloudant workspace ");
    cloudant.insertWorkspace(req, res);
});

app.put('/api/logconversation/workspace/:id', function (req, res) {
    console.log("Chamando serviço update no cloudant workspace ");
    cloudant.updateSelectWorkspace(req, res);
});

app.get('/api/logconversation/workspace', function (req, res) {
    cloudant.listWorkspace(req, res);
});

app.get('/api/logconversation/workspace/selecionado', function (req, res) {
    cloudant.getWorkspaceSelecionada(req, res);
});


http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});

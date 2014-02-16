var express = require('express');
var routes = require('routes/knockout');
var article = require('routes/knockout/article');

var app = express();
app.set('port', process.env.PORT || 3333);
app.set('views', __dirname + '/views');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('justLearningKnockout'));
app.use(express.session());
app.use(app.router);
app.use('/lib/knockout', express.static(path.join(__dirname, 'node_modules/knockout/build/output')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/knockout', routes.index);

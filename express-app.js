
/**
 * Module dependencies.
 */

var express = require('express');
var whiskers = require('whiskers');
var routes = require('./routes/express');
var user = require('./routes/express/user');
var article = require('./routes/express/article');
var frontend = require('./routes/express/frontend');
var rest = require('./routes/rest');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3333);
app.set('views', __dirname + '/views');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('justLearningNodeJS'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('production' != app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/express', routes.index);
app.get('/express/', routes.index);
app.get('/express/users', user.list);
app.get('/express/articles', article.index);
app.get('/express/new', article.edit);
app.get('/express/edit/:id', article.edit);
app.post('/express/save', article.save);

app.get('/frontend', frontend.index);

app.get('/rest/articles', rest.articles);
app.post('/rest/article/new', rest.saveArticle);
app.post('/rest/article/:id', rest.saveArticle);
app.get('/rest/article/:id', rest.getArticle);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

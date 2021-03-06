
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes/express');
var user = require('./routes/express/user');
var article = require('./routes/express/article');
var tag = require('./routes/express/tag');
var image = require('./routes/express/image');
var frontend = require('./routes/express/frontend');
var rest = require('./routes/rest');
var http = require('http');
var path = require('path');

var app = express();

var navbar = require('./lib/navbar');
app.locals.navbar = navbar.navbar;

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
app.use('/lib', express.static(path.join(__dirname, 'node_modules/typeahead.js/dist')));

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
app.get('/express/tags', tag.index);
app.get('/express/tag/new', tag.edit);
app.get('/express/tag/:id', tag.edit);
app.post('/express/tag/save', tag.save);

app.get('/express/image/list', image.index);

app.get('/frontend', frontend.index);

app.get('/rest/articles', rest.articles);
app.post('/rest/article/new', rest.saveArticle);
app.post('/rest/article/:id', rest.saveArticle);
app.get('/rest/article/:id', rest.getArticle);
app.get('/rest/tags', rest.getAllTags);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

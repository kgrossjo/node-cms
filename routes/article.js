var db = require('../database');

exports.index = function(req, res) {
    db.getArticles(function(err, result) {
        result.forEach(function(article) {
            "use strict";
            article.formattedTimestamp = (new Date(article.timestamp)).toISOString();
        });
        res.render('layout.whiskers', {
            title: 'Article List',
            partials: {
                'body': 'article.whiskers'
            },
            error: err,
            articles: result,
            currenttab: '/articles'
        });
    });
}

exports.edit = function(req, res) {
    var id = req.params.id;
    db.getArticle(id, function(err, article) {
        res.render('layout.whiskers', {
            title: 'Edit Article',
            partials: {
                body: 'edit.whiskers'
            },
            error: err,
            article: article,
            currenttab: (id ? null : '/new')
        });
    });
}

exports.save = function(req, res) {
    var article_id = req.body.id;
    var article_title = req.body.title;
    var article_body = req.body.body;
    var article = {
        id: article_id,
        title: article_title,
        body: article_body,
    };
    db.saveArticle(article, function (err, article) {
        res.redirect("/edit/" + article.id);
    });
}


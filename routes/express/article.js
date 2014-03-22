var db = require('../../database');

exports.index = function(req, res) {
    db.getArticles(function(err, result) {
        result.forEach(function(article) {
            "use strict";
            article.formattedTimestamp = (new Date(article.timestamp)).toISOString();
        });
        res.render('express/layout.whiskers', {
            title: 'Article List',
            partials: {
                'body': 'express/article.whiskers'
            },
            error: err,
            articles: result,
            currenttab: 'articles'
        });
    });
};

exports.edit = function(req, res) {
    var id = req.params.id;
    db.getArticle(id, function(err, article) {
        res.render('express/layout.whiskers', {
            title: 'Edit Article',
            partials: {
                head: 'express/edit/header.whiskers',
                body: 'express/edit/body.whiskers'
            },
            error: err,
            article: article,
            currenttab: (id ? null : 'new')
        });
    });
};

exports.save = function(req, res) {
    console.log("<<<");
    console.log(req.body);
    console.log(">>>");
    console.log("Adding tag: " + req.body.add_tag);
    var article = {
        id: req.body.id,
        title: req.body.title,
        body: req.body.body,
        add_tag: req.body.add_tag,
        remove_tag: req.body.remove_tag
    };
    db.saveArticle(article, function (err, article) {
        res.redirect("/express/edit/" + article.id);
    });
};



var db = require('../database');

exports.articles = function(req, res) {
    db.getArticles(function(err, result) {
        if (err) res.send({ type: "error", error: err});
        res.send({ type: "article list", articles: result });
    });
};

exports.getArticle = function(req, res) {
    var id = req.params.id;
    db.getArticle(id, function(err, article) {
        if (err) res.send({ type: "error", error: err});
        res.send(article);
    });
};

exports.saveArticle = function(req, res) {
    console.log("*** " + JSON.stringify(req.body));
    var inp = req.body;
    var art = { id: inp.id, title: inp.title, body: inp.body, };
    db.saveArticle(art, function(err, article) {
        if (err) res.send({ type: "error", error: err});
        res.send({ type: "ok", id: article.id });
    });
};

exports.getAllTags = function(req, res) {
    db.getAllTags(function(err, tags) {
        if (err) res.send({ type: "error", error: err});
        res.send(tags);
    });
};
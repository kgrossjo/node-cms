var db = require('../database');

exports.index = function(req, res) {
    db.getArticles(function(err, result) {
	res.render('article', {
	    title: 'Article List',
	    error: err,
	    articles: result,
	});
    });
}

exports.edit = function(req, res) {
    var id = req.params.id;
    db.getArticle(id, function(err, article) {
        res.render('edit', {
            title: 'Edit Article',
            error: err,
            article: article,
        });
    });
}

exports.save = function(req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var article = {
	id: id,
	title: title,
	body: body,
    };
    db.saveArticle(article, function (err) {
        res.redirect("/edit/" + id);
    });
}


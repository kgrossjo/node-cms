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
    console.log("Silence is foo!");
    res.render('edit', {
	title: 'New Article',
	error: null,
	id: null,
    });
}

exports.save = function(req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    if (id) {
	// save existing article
    } else {
	// save new article
    }
}


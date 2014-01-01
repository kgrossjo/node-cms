"use strict";

var db = require('../../database');
var markdown = require('markdown').markdown;
require('date-format-lite');

exports.index = function(req, res) {
    db.getArticlesForFrontpage(prepareArticles);

    function prepareArticles(err, articles) {
        articles.forEach(function (article) {
            var t = article.teaser.trim();
            if (t.length > 150) {
                t.replace(/\S+$/, '');
            }
            article.teaser = t;
            var date = new Date(article.timestamp);
            article.formattedDate = date.format('DD.MM.YYYY');
            article.teaser = markdown.toHTML(article.teaser);
        });
        var topstory = articles.shift();
        var headlines = articles.slice(0, 15);
        doRender(err, topstory, headlines);
    }

    function doRender(err, topstory, headlines) {
        res.render('frontend/layout.whiskers', {
            title: "The Epoch Times Deutschland",
            topstory: topstory,
            headlines: headlines,
            partials: {
                body: 'frontend/index.whiskers'
            }
        });
    }
};
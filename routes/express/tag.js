"use strict";

var db = require('../../database');

exports.index = function(req, res) {
    db.getAllTags(function(err, result) {
        res.render('express/layout.whiskers', {
            title: 'Tags List',
            partials: {
                body: 'express/tags.whiskers'
            },
            error: err,
            tags: result,
            currenttab: 'tags'
        });
    });
};
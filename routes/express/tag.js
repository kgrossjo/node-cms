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

exports.edit = function(req, res) {
    var id = req.params.id;
    db.getTag(id, function(err, tag) {
        res.render('express/layout.whiskers', {
            title: 'Edit Tag',
            partials: {
                head: 'express/tag/header.whiskers',
                body: 'express/tag/body.whiskers'
            },
            error: err,
            tag: tag,
            currenttab: (id ? null : 'new-tag')
        });
    })
};

exports.save = function(req, res) {
    var tag_id = req.body.id;
    var tag_name = req.body.name;
    var tag_description = req.body.description;
    var tag = {
        id: tag_id,
        name: tag_name,
        description: tag_description
    };
    db.saveTag(tag, function(err, tag) {
        res.redirect("/express/tag/" + tag.id);
    });
};
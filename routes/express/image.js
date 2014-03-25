"use strict";
var db = require('../../database');

exports.index = function (req, res) {
    db.getImages(function (err, result) {
        res.render('express/layout.whiskers', {
            title: 'Image List',
            partials: {
                body: 'express/image/list.whiskers'
            },
            error: err,
            images: result,
            currenttab: 'images'
        });
    });
};
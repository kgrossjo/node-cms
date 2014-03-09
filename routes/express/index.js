
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('express/layout.whiskers', {
        title: 'The Simple CMS',
        currenttab: 'home',
        partials: {
            'body': 'express/index.whiskers'
        }
    });
};

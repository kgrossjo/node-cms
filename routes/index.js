
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('layout.whiskers', {
        title: 'The Simple CMS',
        currenttab: '/',
        partials: {
            'body': 'index.whiskers'
        }
    });
};

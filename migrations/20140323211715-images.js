var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    createimages();
    function createimages() {
        db.createTable('images', {
            id: {type: type.INTEGER, primaryKey: true, autoIncrement: true},
            filename: type.STRING,
            data: 'LONGBLOB'
        }, createderived);
    }
    function createderived(err) {
        if (err) { return callback(err); }
        db.createTable('imagederived', {
            original: type.INTEGER,
            derived: type.INTEGER
        }, createmm);
    }
    function createmm(err) {
        if (err) { return callback(err); }
        db.createTable('mm_article_image', {
            article: type.INTEGER,
            image:   type.INTEGER
        }, callback);
    }
};

exports.down = function(db, callback) {
    dropmm();
    function dropmm() {
        db.dropTable('mm_article_image', dropderived);
    }
    function dropderived(err) {
        if (err) { return callback(err); }
        db.dropTable('imagederived', dropimages);
    }
    function dropimages(err) {
        if (err) { return callback(err); }
        db.dropTable('images', callback);
    }
};

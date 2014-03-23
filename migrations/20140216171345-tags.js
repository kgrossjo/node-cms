var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {

    db.createTable('tags', {
        id: {type: type.INTEGER, primaryKey: true, autoIncrement: true, },
        name: type.STRING,
        description: type.STRING,
    }, createRelation);

    function createRelation() {
        db.createTable('mm_article_tag', {
            tag: type.INTEGER,
            article: type.INTEGER,
            sort: type.INTEGER
        });
        callback();
    }
};

exports.down = function(db, callback) {

    db.dropTable('mm_article_tag', { ifExists: true }, dropRelation);

    function dropRelation() {
        db.dropTable('tags', { ifExists: true }, callback);
    }
};

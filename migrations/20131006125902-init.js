var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('articles', {
	id: {type: 'int', primaryKey: true, autoIncrement: true},
	title: 'string',
	body: 'string',
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('articles', callback);
};

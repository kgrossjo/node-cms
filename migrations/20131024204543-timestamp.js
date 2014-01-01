var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.addColumn('articles', 'timestamp', {
        type: 'bigint',
        defaultValue: 0,
        notNull: true
    }, callback);
};

exports.down = function(db, callback) {
    db.removeColumn('articles', 'timestamp', callback);
};

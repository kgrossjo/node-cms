var mysql = require('mysql');
var dbconfig = require('./database.json');

var pool = mysql.createPool({
    host: dbconfig.dev.host,
    user: dbconfig.dev.user,
    password: dbconfig.dev.password,
    database: dbconfig.dev.database,
    connectionLimit: 10,
    supportBigNumbers: true,
});

// Get a connection from the pool, execute `sql` in it
// with the given `bindings`.  Invoke `cb(true)` on error,
// invoke `cb(false, results)` on success.  Here,
// `results` is an array of results from the query.
function with_connection(sql, bindings, cb) {
    pool.getConnection(function(err, conn) {
	if (err) {
	    conn.release();
	    console.log("Error in with_connection (getConnection): " + JSON.stringify(err));
	    cb(true);
	    return;
	}
	conn.query(sql, bindings, function(err, results) {
	    if (err) {
	        conn.release();
		console.log("Error in with_connection (query): " + JSON.stringify(err));
		cb(true);
		return;
	    }
            conn.release();
            console.log("with_connection results: " + JSON.stringify(results));
	    cb(false, results);
	});
    });
}

// cb - function(is_err, results)
//      if is_err is true, then the second argument is ignored
//      if is_err is false, then the second argument is the list of results.
exports.getArticles = function(cb) {
    var sql = "SELECT id,title FROM articles ORDER BY id DESC";
    with_connection(sql, [], cb);
};

exports.getArticle = function(id, cb) {
    var sql = "SELECT id,title,body FROM articles WHERE id = ?";
    with_connection(sql, [id], function (err, results) {
        if (err) {
            cb(err);
        } else if (! results || ! results.length) {
            cb(false, null);
        } else {
            cb(false, results[0]);
        }
    });
};


exports.saveArticle = function(article, cb) {
    if (article.id) {
	save_existing_article(article, cb);
    } else {
	save_new_article(article, cb);
    }
}

function save_new_article(article, cb) {
    var sql = "INSERT INTO articles(title,body) values (?,?)";
    with_connection(sql, [article.title, article.body], cb);
}

function save_existing_article(article, cb) {
    var sql = "UPDATE articles SET title=?, body=? WHERE id=?";
    with_connection(sql, [article.title, article.body, article.id], cb);
}
    


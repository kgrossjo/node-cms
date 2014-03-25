"use strict";

var mysql = require('mysql');
var dbconfig = require('./database.json');

var pool = mysql.createPool({
    host: dbconfig.dev.host,
    user: dbconfig.dev.user,
    password: dbconfig.dev.password,
    database: dbconfig.dev.database,
    connectionLimit: 10,
    supportBigNumbers: true
});


// Get a connection from the pool, execute `sql` in it
// with the given `bindings`.  Invoke `cb(true)` on error,
// invoke `cb(false, results)` on success.  Here,
// `results` is an array of results from the query.
function with_connection(sql, bindings, cb) {

    function getConnectionCb(err, conn) {
        if (err) {
            console.log("Error in with_connection/getConnectionCb: " + JSON.stringify(err));
            cb(true);
            return;
        }
        conn.query(sql, bindings, queryCb);
    }

    function queryCb(err, results) {
        if (err) {
            console.log("Error in with_connection/queryCb: " + JSON.stringify(err));
            cb(true);
            return;
        }
        cb(false, results);
    }

    pool.getConnection(getConnectionCb);
}

function now() {
    return (new Date()).getTime();
}

// ------------------------------------------------------------
// -- articles --
// ------------------------------------------------------------

// cb - function(is_err, results)
//      if is_err is true, then the second argument is ignored
//      if is_err is false, then the second argument is the list of results.
exports.getArticles = function(cb) {
    var sql = "SELECT id,title,timestamp FROM articles ORDER BY id DESC";
    with_connection(sql, [], cb);
};

exports.getArticlesForFrontpage = function(cb) {
    "use strict";
    var sql = "SELECT id, title, timestamp, left(body, 150) AS teaser FROM articles ORDER BY id DESC LIMIT 90";
    with_connection(sql, [], cb);
}


exports.getArticle = function(id, cb) {
    var sql = "SELECT id,title,body FROM articles WHERE id = ?";
    var tags_sql = "SELECT t.id, t.name, mm.sort FROM tags t, mm_article_tag mm WHERE t.id = mm.tag AND mm.article = ?";
    with_connection(sql, [id], function (err, results) {
        if (err) {
            cb(err);
        } else if (! results || ! results.length) {
            cb(false, null);
        } else {
            with_connection(tags_sql, [id], function(err, tag_results) {
                if (err) {
                    cb(err);
                } else {
                    var article = results[0];
                    article.tags = tag_results;
                    cb(false, article);
                }
            });
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
    var sql = "INSERT INTO articles(title,body,timestamp) values (?,?,?)";
    function after_insert(err, results) {
        if (err) {
            cb(err);
        } else {
            article.id = results.insertId;
            add_tag_to_article(article, cb);
        }
    }
    with_connection(sql, [article.title, article.body, now()], after_insert);
}

function save_existing_article(article, cb) {
    var sql = "UPDATE articles SET title=?, body=?, timestamp=? WHERE id=?";
    var ts = now();
    console.log("save_existing_article: sql=" + sql);
    console.log("article=" + JSON.stringify(article));
    with_connection(sql, [article.title, article.body, ts, article.id], add_tags);
    function add_tags(err, results) {
        if (err) {
            cb(err);
        } else {
            console.log("save article - add tag to article");
            add_tag_to_article(article, remove_tags);
            console.log("save article - after add tag to article");
        }
    }
    function remove_tags(err, results) {
        if (err) {
            cb(err);
        } else {
            console.log("save article - removing tags");
            remove_tags_from_article(article, cb);
        }
    }
}

function add_tag_to_article(article, cb) {
    console.log("in add_tag_to_article");
    if (! article.add_tag) {
        console.log("no tag to add");
        cb(false, article);
        return;
    }
    getTagByName(article.add_tag, with_tag);
    function with_tag(err, tag) {
        console.log("in with_tag");
        if (err) {
            cb(err);
        } else {
            console.log("invoking insert into mm_article_tag");
            var sql = "INSERT INTO mm_article_tag(tag, article, sort) VALUES (?, ?, ?)";
            with_connection(sql, [tag.id, article.id, 1], after_insert);
        }
    }
    function after_insert(err, results) {
        console.log("in after_insert");
        if (err) {
            cb(err);
        } else {
            console.log("invoking callback from after_insert from add_tag_to_article");
            cb(false, article);
        }
    }
}

function remove_tags_from_article(article, cb) {
    console.log("in remove_tags_from_article");
    if (! article.remove_tag) {
        console.log("no tag to remove");
        cb(false, article);
        return;
    }
    var tag_ids = [];
    var remove_tag = article.remove_tag;
    for (var t in remove_tag) {
        if (remove_tag[t] != 'on') continue;
        t = t.substr(1);
        tag_ids.push(t);
    }
    return remove_taglist_from_article(tag_ids, article, cb);
}

function remove_taglist_from_article(tag_ids, article, cb) {
    if (! tag_ids.length) return cb(false, article);
    var t = tag_ids.pop();
    return remove_tag_from_article(t, article.id, remove_rest);

    function remove_rest(err, result) {
        return remove_taglist_from_article(tag_ids, article, cb);
    }
}


function remove_tag_from_article(tag_id, article_id, cb) {
    var sql = "DELETE FROM mm_article_tag WHERE tag = ? AND article = ?";
    console.log("Removing tag " + tag_id + " from article " + article_id);
    with_connection(sql, [tag_id, article_id], cb);
}


// ------------------------------------------------------------
// -- tags --
// ------------------------------------------------------------

exports.getAllTags = function(cb) {
    var sql = "SELECT id, name, description FROM tags ORDER BY name";
    with_connection(sql, [], cb);
};

exports.getTag = function getTag(id, cb) {
    var sql = "SELECT id, name, description FROM tags WHERE id = ?";
    with_connection(sql, [id], function(err, results) {
        if (err) {
            cb(err);
        } else if (! results || ! results.length) {
            cb(false, null);
        } else {
            cb(false, results[0]);
        }
    })
};

function getTagByName(name, cb) {
    var sql = "SELECT id, name, description FROM tags WHERE name = ?";
    with_connection(sql, [name], function(err, results) {
        if (err) {
            cb(err);
        } else if (! results || ! results.length) {
            cb(false, null);
        } else {
            cb(false, results[0]);
        }
    })
}

exports.saveTag = function(tag, cb) {
    if (tag.id) {
        save_existing_tag(tag, cb);
    } else {
        save_new_tag(tag, cb);
    }
};

function save_new_tag(tag, cb) {
    var sql = "INSERT INTO tags(id, name, description) values (?, ?, ?)";
    function after_insert(err, results) {
        if (err) {
            cb(err);
        } else {
            tag.id = results.insertId;
            cb(false, tag);
        }
    }
    with_connection(sql, [tag.id, tag.name, tag.description], after_insert);
}

function save_existing_tag(tag, cb) {
    var sql = "UPDATE tags SET name=?, description=? WHERE id=?";
    function after_insert(err, results) {
        if (err) {
            cb(err);
        } else {
            cb(false, tag);
        }
    }
    with_connection(sql, [tag.name, tag.description, tag.id], after_insert);
}

// ------------------------------------------------------------
// -- images --
// ------------------------------------------------------------

// cb - function(is_err, results)
//      If is_err is true, then the second argument is ignored
//      If is_err is false, then the second argument is the list of results.
exports.getImages = function (cb) {
    var sql = "SELECT id,filename FROM images ORDER BY id DESC";
    with_connection(sql, [], cb);
};
var NAVBAR = [
    {id: 'home',        href: '/express',          label: 'Home'},
    {id: 'new',         href: '/express/new',      label: 'Create new article'},
    {id: 'articles',    href: '/express/articles', label: 'List articles'},
    {id: 'tags',        href: '/express/tags',     label: 'List tags'},
    {id: 'new-tag',     href: '/express/tag/new',  label: 'Create new tag'},
    {id: 'frontend',    href: '/frontend',         label: 'Frontend'}
];

exports.navbar = function navbar(req, res) {
    console.log("req: " + JSON.stringify(req));
    console.log("res: " + JSON.stringify(res));
    console.log("arguments: " + JSON.stringify(Array.prototype.slice.call(arguments, 0)));
    var navbar = Object.create(NAVBAR);
    navbar.forEach(function (x) {
        x.active = (x.id == req.currenttab);
    });
    var result = navbar.map(function (x) {
        var s = '<li @ACTIVE@><a href="@HREF@">@LABEL@</a></li>';
        if (x.active) {
            s = s.replace('@ACTIVE@', 'class="active"');
        } else {
            s = s.replace('@ACTIVE@', '');
        }
        s = s.replace('@HREF@', x.href);
        s = s.replace('@LABEL@', x.label);
        return s;
    });
    console.log("result: " + JSON.stringify(result));
    return result.join("\n");
};
jQuery(document).ready(function($) {

    $(".clickable-link").click(function() {
        "use strict";
        window.document.location = $(this).attr("href");
    });

    $('.cms-btn-back').click(function() {
        "use strict";
        history.back();
    })
});
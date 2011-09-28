var $ = jQuery.noConflict();

Gmailr.debug = false; // Turn verbose debugging messages on

function built_anchor(G) {
    var attachment_rows = $(G.$('div.hq.gt'));
    $.each(attachment_rows, function(i, $attachment) {
        var view_node = $($attachment).find("a:contains('View')");
        if(view_node) {
            var _href = view_node.attr('href');
            _href = _href.replace('viewer?a=v', 'viewer?a=sv');

            var download_link = $("<a>").attr({
                "class" : "docs_autosave_anchor",
                "target": "_blank",
                "href"  : _href
            }).append('Save To Docs');

            view_node.after(download_link);
            view_node.after("&nbsp;&nbsp;&nbsp;");
        }
    });
}

function check_virus_scanning(G) {
    if(!$("body:contains('Scanning for viruses...')")) {
        console.log('nope');
        built_anchor(G);
    } else {
        window.setTimeout(check_virus_scanning, 100);
    }
}

Gmailr.init(function(G) {
    G.observe('viewChanged', function(view) {
        if(view == 'conversation') {
            setTimeout(built_anchor(G), 10000);
        }
    });
});

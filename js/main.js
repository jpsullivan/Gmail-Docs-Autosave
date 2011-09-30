Gmailr.debug = false; // Turn verbose debugging messages on

function built_anchor(G) {
    console.log('rebuilding');
    if(jQuery('#canvas_frame').contents().find('div[role="main"]:contains("Scanning for viruses...")').length == 0) {
        var attachment_rows = jQuery('#canvas_frame').contents().find('div[role="main"] div.hq.gt');
        jQuery.each(attachment_rows, function(i, $attachment) {
            var view_node = jQuery($attachment).find("a:contains('View')");
            if(view_node.length > 0) {
                var _href = view_node.attr('href');
                if(!_href.length > 0) {
                    built_anchor(G);
                }
                _href = _href.replace('viewer?a=v', 'viewer?a=sv');

                var download_link = jQuery("<a>").attr({
                    "class" : "docs_autosave_anchor",
                    "target": "_blank",
                    "href"  : _href
                }).append('Save To Docs');

                view_node.after(download_link);
                view_node.after("&nbsp;&nbsp;&nbsp;");
                $(document).stopTime();
            }
        });
    }
}

Gmailr.init(function(G) {
    G.observe('viewChanged', function(view) {
        if(view == 'conversation') {
            $(document).everyTime('1s', function(i) {
                built_anchor(G);
            });
        }
    });
});
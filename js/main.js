Gmailr.debug = false; // Turn verbose debugging messages on

function getUrlVars(gm_url) {
    gm_url = decodeURIComponent(gm_url);
    var vars = [], hash;
    var hashes = gm_url.slice(gm_url.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function built_anchor(G) {
    if(jQuery('#canvas_frame').contents().find('div[role="main"]:contains("Scanning for viruses...")').length == 0) {
        var attachment_rows = jQuery('#canvas_frame').contents().find('div[role="main"] div.hq.gt table');
        jQuery.each(attachment_rows, function(i, $attachment) {
            var view_node = jQuery($attachment).find("a:contains('View')");
            if(view_node.length > 0) {
                var _href = view_node.attr('href');
                if(!_href.length > 0) {
                    built_anchor(G);
                }
                var urlVars = getUrlVars(_href);
//                _href = _href.replace('viewer?a=v', 'viewer?a=sv');
                _href = generate_download_url(_href);

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

function generate_download_url(gm_url) {
    // Check if we already have our "ik" property in the gm_url
    var url_vars = getUrlVars(gm_url);
    return 'https://docs.google.com/viewer?a=sv&attid=' + url_vars.attid +'&pid=gmail&thid=' + url_vars.th + '&ik=' + url_vars.ik + '&disp=safe&zw&view=att&th=' + url_vars.th;
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
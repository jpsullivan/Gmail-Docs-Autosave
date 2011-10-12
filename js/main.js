Gmailr.debug = true; // Turn verbose debugging messages on

var DOM_UPDATE_REPROCESS_WAIT_TIME_MS = 1000;  // 1s
var NUM_TIMES_CHECKED_FOR_DOM = 0;
// Timer used to reprocess the page on updates after a delay.
var linkCheckTimer = undefined;

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

function built_anchor() {
    if(jQuery('#canvas_frame').contents().find('div[role="main"]:contains("Scanning for viruses...")').length == 0) {
        var attachment_rows = jQuery('#canvas_frame').contents().find('div[role="main"] div.hq.gt table');
        jQuery.each(attachment_rows, function(i, $attachment) {
            var view_node = jQuery($attachment).find("a:contains('View')");
            if(view_node.length > 0) {
                var _href = view_node.attr('href');
                _href = generate_download_url(_href);

                var download_link = jQuery("<a>")
                    .attr({
                        "class" : "docs_autosave_anchor",
                        "target": "_blank",
                        "href"  : _href
                    })
                    .append('Save To Docs');

                view_node.after(download_link);
                view_node.after("&nbsp;&nbsp;&nbsp;");
                
                verify_add_link();
            } else {
                // maybe we're ahead of schedule.  Try again (if allowed)
                if (NUM_TIMES_CHECKED_FOR_DOM < 5) {
                    // Try again
                    clearTimeout(linkCheckTimer);
                    var linkCheckTimer = setTimeout(function() {
                        built_anchor();
                    }, DOM_UPDATE_REPROCESS_WAIT_TIME_MS);
                } else {
                    // Assume the element simply isn't there.  Move along, citizen.
                    clear_timers();
                }
            }
        });
    }
}

function verify_add_link() {
    if(jQuery('a.docs_autosave_anchor').length) {
        clear_timers();
    }
}

function clear_timers() {
    clearTimeout(linkCheckTimer);
    linkCheckTimer = undefined;
}

function generate_download_url(gm_url) {
    // Check if we already have our "ik" property in the gm_url
    var url_vars = getUrlVars(gm_url),
        url_split = gm_url.substring(0,gm_url.indexOf('?') +1),
        params = "",
        result = '';

    jQuery.each(url_vars, function(i, $url_var) {
        if(url_vars[$url_var] === void 0) { // if array key-value is undefined...
            params += '&'+$url_var;
        } else {
            if($url_var !== "a" && $url_var !== "url") {
                params += '&'+$url_var+'='+url_vars[$url_var];
            }
        }
    });

    if(!url_vars.hasOwnProperty('url')) {
        var encoded_uri = encodeURIComponent(window.location.origin + window.location.pathname + url_split + 'a=sv' + params);
    } else if(url_vars.url.substr(0) === '?') {
        var encoded_uri = encodeURIComponent(window.location.origin + window.location.pathname + url_split + 'a=sv' + params);
    } else {
        var encoded_uri = encodeURIComponent(url_split + 'a=sv' + params);
    }
    result = 'https://docs.google.com/viewer?a=sv&pid=gmail&thid=' + url_vars.th + '&attid=' + url_vars.attid + params + '&url=' + encoded_uri;

    return result;
}

function handleDomChanges() {
    clearTimeout(linkCheckTimer);
    var linkCheckTimer = setTimeout(function() {
        built_anchor();
    }, DOM_UPDATE_REPROCESS_WAIT_TIME_MS);
}

Gmailr.init(function(G) {
    G.observe('viewChanged', function(view) {
        console.log(view);
        if(view == 'conversation') {
            handleDomChanges();
        }
    });
});
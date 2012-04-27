var DOM_UPDATE_REPROCESS_WAIT_TIME_MS = 2000;  // 2s

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
    var view_nodes = jQuery('#canvas_frame').contents().find('a[href*="&disp=inline"][href*="&safe=1&zw"][class!="drive_autosave_anchor"]:hasText');
    var openformat_nodes = jQuery('#canvas_frame').contents().find('a[href*="a=v&"][class!="drive_autosave_anchor"]:hasText');

    view_nodes = view_nodes.add(openformat_nodes);

    jQuery.each(view_nodes, function(i, view_node) {
        $view_node = jQuery(view_node);
        if(!nodeProcessed($view_node)) {
            var _href = $view_node.attr('href');
                _href = generate_download_url(_href);

            var download_link = jQuery("<a>")
                .attr({
                    "class" : "drive_autosave_anchor",
                    "target": "_blank",
                    "href"  : _href,
                    "style" : "text-decoration:none;"
                })
                .append('Save To Drive');

            $view_node.after(download_link);
            $view_node.after("&nbsp;&nbsp;&nbsp;");
        }
    });
}

function nodeProcessed($view_node) {
    var $next_node = $view_node.next();
    if($next_node.hasClass('drive_autosave_anchor')) {
        return true;
    }
    return false;
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

jQuery.expr[':'].hasText = function(element, index) {
     // if there is only one child, and it is a text node
     if (element.childNodes.length == 1 && element.firstChild.nodeType == 3) {
        return jQuery.trim(element.innerHTML).length > 0;
     }
     return false;
};

jQuery(document).ready(function() {
    jQuery.doTimeout('delayed', DOM_UPDATE_REPROCESS_WAIT_TIME_MS, function() {
        built_anchor();

        return true; // continue polling
    });
});
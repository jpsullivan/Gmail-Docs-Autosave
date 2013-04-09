var $jq = jQuery.noConflict();

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
    var view_nodes = $jq('table.cf.hr').contents().find('a[href*="&disp=inline"][href*="&safe=1&zw"][class!="drive_autosave_anchor"]:hasText');
    var openformat_nodes = $jq('table.cf.hr').contents().find('a[href*="a=v&"][class!="drive_autosave_anchor"]:hasText');

    view_nodes = view_nodes.add(openformat_nodes);

    $jq.each(view_nodes, function(i, view_node) {
        $view_node = $jq(view_node);
        if(!nodeProcessed($view_node)) {
            var _href = generate_download_url($view_node.attr('href'));

            var download_link = $jq("<a>")
                .attr({
                    "class" : "drive_autosave_anchor",
                    "target": "_blank",
                    "href"  : _href,
                    "style" : "text-decoration:none;"
                })
                .append('Save To Drive')
                .click(testAuth());

            $view_node.after(download_link);
            $view_node.after("&nbsp;&nbsp;&nbsp;");
        }
    });
}

function testAuth() {
    this.client = new gdocs.Client;
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

    $jq.each(url_vars, function(i, $url_var) {
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

$jq.expr[':'].hasText = function(element, index) {
     // if there is only one child, and it is a text node
     if (element.childNodes.length == 1 && element.firstChild.nodeType == 3) {
        return $jq.trim(element.innerHTML).length > 0;
     }
     return false;
};

$jq(document).ready(function() {
    var DOM_UPDATE_REPROCESS_WAIT_TIME_MS = 2000;  // 2s
    $jq.doTimeout('delayed', DOM_UPDATE_REPROCESS_WAIT_TIME_MS, function() {
        built_anchor();

        return true; // continue polling
    });
});
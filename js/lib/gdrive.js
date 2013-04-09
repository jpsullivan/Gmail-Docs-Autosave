var goog = goog || {}, gdocs = {};
gdocs.GOOGLE_DOCS_ROOT_URL = "https://docs.google.com/";
gdocs.IMPRESSION = {
    OTHER: 0,
    LINK: 2,
    IMAGE: 3,
    AUDIO: 4,
    VIDEO: 5,
    PAGE_ACTION_URL: 6,
    PAGE_ACTION_DOC: 7,
    PAGE_ACTION_HTML: 8,
    PAGE_ACTION_CAPTURE_IMAGE_VISIBLE: 9,
    PAGE_ACTION_CAPTURE_MHTML: 10,
    DATA_WEB_INTENT: 13,
    URL_WEB_INTENT: 14,
    PAGE_ACTION_CAPTURE_IMAGE_ENTIRE: 15
};
gdocs.HttpStatus = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    RESUME_INCOMPLETE: 308,
    UNAUTHORIZED: 401
};
gdocs.IMPRESSION_HEADER = "X-DocsExt-Action";
gdocs.impressionHeader = function (a, b) {
    var c = b || {};
    c[gdocs.IMPRESSION_HEADER] = a.toString();
    return c
};
gdocs.MAX_GENERATED_TITLE_LEN = 50;
gdocs.MAX_SUFFIX_LEN = 8;
gdocs.UPLOAD_CHUNK_SIZE = 262144;
gdocs.KEYCODE_ESCAPE = "27";
gdocs.MIME_TYPE = {
    ATOM: "application/atom+xml",
    HTML: "text/html",
    MHTML: "text/mhtml",
    OCTET_STREAM: "application/octet-stream",
    PLAIN: "text/plain",
    PDF: "application/pdf",
    PNG: "image/png",
    X_PDF: "application/x-pdf",
    XML: "text/xml"
};
gdocs.EXTENSIONS = {
    "application/msword": "doc",
    "application/pdf": "pdf",
    "application/rtf": "rtf",
    "application/vnd.ms-excel": "xls",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "application/x-gzip": "gzip",
    "application/x-pdf": "pdf",
    "application/zip": "zip",
    "audio/mp4": "mp4",
    "audio/mpeg": "mp3",
    "audio/ogg": "ogg",
    "audio/vnd.wave": "wav",
    "image/gif": "gif",
    "image/jpeg": "jpg",
    "image/pjpeg": "jpg",
    "image/png": "png",
    "image/svg+xml": "svg",
    "image/tiff": "tif",
    "image/vnd.microsoft.icon": "ico",
    "text/css": "css",
    "text/csv": "csv",
    "text/html": "html",
    "text/mhtml": "mht",
    "text/plain": "txt",
    "text/tsv": "tsv",
    "text/xml": "xml",
    "video/mp4": "mp4",
    "video/mpeg": "mpg",
    "video/ogg": "ogg"
};
gdocs.CONVERTIBLE = {
    "application/msword": !0,
    "application/rtf": !0,
    "application/vnd.ms-excel": !0,
    "application/vnd.ms-powerpoint": !0,
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": !0,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": !0,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": !0,
    "text/csv": !0,
    "text/html": !0,
    "text/plain": !0,
    "text/tsv": !0
};
gdocs.ACTION_ID = {
    BUG_INTERNAL: "bug-internal",
    FEEDBACK_INTERNAL: "feedback-internal",
    HELP: "help",
    HTML: "html",
    HTML_DOC: "htmldoc",
    IMAGE_ENTIRE: "image-entire",
    IMAGE_VISIBLE: "image-visible",
    MHTML: "mhtml",
    OPTIONS: "options",
    SEND_FEEDBACK: "send-feedback",
    URL: "url"
};


// Client operations
gdocs.Client = function () {
    this.oauth_ = ChromeExOAuth.initBackgroundPage({
        request_url: "https://accounts.google.com/OAuthGetRequestToken",
        authorize_url: "https://accounts.google.com/OAuthAuthorizeToken",
        access_url: "https://accounts.google.com/OAuthGetAccessToken",
        consumer_key: "anonymous",
        consumer_secret: "anonymous",
        scope: "https://docs.google.com/feeds/",
        app_name: "Gmail Attachments to Drive"
    })
};
gdocs.Client.AuthState= {
	AUTHENTICATED: "authenticated",
	AUTH_FAILED: "auth_failed"
}
gdocs.Client.prototype.isAuthorized = function () {
    return !!this.oauth_.hasToken()
};
gdocs.Client.prototype.oauthLogin = function (a) {
    this.oauth_.authorize(goog.bind(this.oAuthAuthorizeCallback_, this, a))
};
gdocs.Client.prototype.oAuthAuthorizeCallback_ = function (a, b) {
    b || this.oauth_.clearTokens();
    a(b ? gdocs.Client.AuthState.AUTHENTICATED : gdocs.Client.AuthState.AUTH_FAILED)
};
gdocs.Client.prototype.sendRequest = function (a, b, c, d, e, g, f, i) {
    if (i) {
        c = this.encodeParams_(c);
        0 < c.length && (b = b + "?" + c);
        var h = new XMLHttpRequest;
        h.onreadystatechange = function () {
            4 == h.readyState && g(h)
        };
        h.open(a, b, !0);
        if (d) for (var j in d) h.setRequestHeader(j, d[j]);
        h.send(e)
    } else if (this.isAuthorized()) {
        a = {
            method: a,
            headers: d,
            body: e
        };
        c && (a.parameters = c);
        try {
            this.oauth_.sendSignedRequest(b, goog.bind(this.oAuthCallback_, this, g, f, b), a)
        } catch (k) {
            gdlog.warn("Client.sendRequest", "Exception sending signed request:" +
                gdlog.prettyPrint(a) + " to url:" + b + " e:" + k), f(k)
        }
    } else this.authFailCallback_(f, b)
};
gdocs.Client.prototype.oAuthCallback_ = function (a, b, c, d, e) {
    e.status == gdocs.HttpStatus.UNAUTHORIZED ? (this.oauth_.clearTokens(), this.authFailCallback_(b, c)) : a(e)
};
gdocs.Client.prototype.authFailCallback_ = function (a, b) {
    var c = chrome.i18n.getMessage("AUTH_URL_FAILURE", b);
    gdlog.warn("Client.sendRequest", c);
    a(Error(c))
};
gdocs.Client.prototype.logout = function () {
    this.oauth_.clearTokens()
};
gdocs.Client.prototype.encodeParams_ = function (a) {
    if (!a) return "";
    var b = [],
        c = 0,
        d;
    for (d in a) b[c++] = encodeURIComponent(d) + "=" + encodeURIComponent(a[d]);
    return b.join("&")
};
gdocs.ContextMenu = {};
gdocs.ContextMenu.ContextType = {
    PAGE: "page",
    LINK: "link",
    IMAGE: "image",
    VIDEO: "video",
    AUDIO: "audio"
};
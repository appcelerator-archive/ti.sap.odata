if (Ti.Platform.osname == 'mobileweb') {
    define([], function () {
        return DataJSWrapper({});
    });
}
else {
    DataJSWrapper(exports);
}

function DataJSWrapper(exports) {
    if (Ti.Platform.osname != 'mobileweb') {
        this.JSON = JSON;
        this.setTimeout = setTimeout;
        this.clearTimeout = clearTimeout;
        this.alert = alert;
        this.document = Ti.XML.parseString('<a/>');
        this.DOMParser = function () {
            this.parseFromString = function (xmlString) {
                return Ti.XML.parseString(xmlString);
            };
        };
        this.XMLSerializer = function () {
            this.serializeToString = function (domNode) {
                var s = '<?xml version="1.0" encoding="utf-8"?>' + Ti.XML.serializeToString(domNode);
                if (Ti.Platform.name != 'android') {
                    s = s.split('xmlns:xmlns=\"http://www.w3.org/2000/xmlns/\"').join('');
                }
                return s;
            };
        };
        this.xhrOverride = function (url, request, success, error) {
            var xhr = Ti.Network.createHTTPClient({
                onload: function () {
                    var headers;
                    if (this.getResponseHeaders) {
                        // iOS
                        headers = this.getResponseHeaders();
                    }
                    else if (this.allResponseHeaders) {
                        // Android
                        headers = {};
                        var rawHeaders = this.allResponseHeaders;
                        var pairs = rawHeaders.split('\n');
                        for (var p = 0; p < pairs.length; p++) {
                            var keyValues = pairs[p].split(':');
                            headers[keyValues.shift()] = keyValues.join(':');
                        }
                    }
                    else {
                        throw 'Unsupported platform! Don\'t know how to get headers from Ti.Network.HTTPClient!';
                    }
                    var response = {
                        requestUri: url,
                        statusCode: this.status,
                        statusText: this.statusText,
                        headers: headers,
                        body: this.responseText
                    };
                    url = null;

                    if (this.status >= 200 && this.status <= 299) {
                        success(response);
                    } else {
                        error({ message: 'HTTP request failed', request: request, response: this.responseText });
                    }
                    request = xhr = success = error = null;
                },
                onerror: function (evt) {
                    error({ message: 'HTTP request failed', request: request, response: this.responseText });
                    request = xhr = success = error = null;
                }
            });
            
			// Optional format query string
            if (request.formatQueryString) {
                var queryString = encodeURI(request.formatQueryString);
                var qIndex = url.indexOf("?");
                if (qIndex === -1) {
                    url = url + "?" + queryString;
                } else if (qIndex === url.length - 1) {
                    url = url + queryString;
                } else {
                    url = url + "&" + queryString;
                }
            }
          
            xhr.open(request.method || 'GET', url);
            for (var h in request.headers) {
                if (request.headers.hasOwnProperty(h))
                    xhr.setRequestHeader(h, request.headers[h]);
            }
            if (request.user) {
                xhr.setRequestHeader('Authorization', 'Basic '
                    + Ti.Utils.base64encode(request.user + ':' + request.password));
            }
            if (request.method in { PUT: 1, POST: 1, DELETE: 1 }) {
                xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');
                xhr.setRequestHeader('X-requested-with', 'XMLHttpRequest');
                xhr.setRequestHeader('X-Request-With', 'X');
            }
            xhr.send(request.body || {});
            return xhr;
        };
    }

    Ti.include('microsoft.datajs.js');

    exports.read = this.OData.read;
    exports.request = this.OData.request;

    return exports;
}
exports.init = function (win, ready) {
    var api = {
        read: function (urlOrRequest, success, error, handler, httpClient, metadata) {
            if (!tryHandlingJSON(urlOrRequest, success, error))
                enqueue('read', urlOrRequest, success, error, handler, httpClient, metadata);
        },
        request: function (request, success, error, handler, httpClient, metadata) {
            if (!tryHandlingJSON(request, success, error))
                enqueue('request', request, success, error, handler, httpClient, metadata);
        }
    };

    var lastCallID = 0;
    var queuedFunctions = {};

    function tryHandlingJSON(request, success, error) {
        if (typeof request != 'object' || !request.accept || request.accept != 'application/json')
            return false;
        request.body = request.data && JSON.stringify(request.data);
        handleRequest(request.requestUri, request, function (type, response) {
            var data = false;
            if (response) {
                if (response.body) {
                    var json = response.body;
                    delete response.body;
                    try {
                        json = trim12(json);
                        if (json && json.length > 0) {
                            json = JSON.parse(json);
                        }
                        data = json.length != undefined && typeof json != 'string'
                            ? { results: json }
                            : json;
                    } catch (err) {
                        error(err);
                        return true;
                    }
                }
            }
            if (type == 'success') {
                success(data, response);
            } else {
                error(response);
            }
        });
        return true;
    }

    function enqueue(name, urlOrRequest, success, error, handler, httpClient, metadata) {
        lastCallID += 1;
        queuedFunctions[lastCallID] = { success: success, error: error };
        web.evalJS('OData.' + name + '('
            + JSON.stringify(urlOrRequest) + ','
            + 'curryCrossContext("success", ' + lastCallID + '),'
            + 'curryCrossContext("error", ' + lastCallID + '),'
            + ((handler && JSON.stringify(handler)) || 'undefined') + ','
            + ((httpClient && JSON.stringify(httpClient)) || 'undefined') + ','
            + ((metadata && JSON.stringify(metadata)) || 'undefined')
            + ');'
        );
    }

    var web = Ti.UI.createWebView({
        html: '<html><head><script type="text/javascript" src="datajs-1.0.3.tijs"></script>\
            <script type="text/javascript">\
                function curryCrossContext(name, id) {\
                    return function() {\
                        Ti.App.fireEvent("datajs-ti-dequeueFunction", {\
                            name: name,\
                            id: id,\
                            args: JSON.stringify(Array.apply(null,arguments))\
                        });\
                    };\
                }\
                var lastCallID = 0;\
                var queuedFunctions = {};\
                Ti.App.addEventListener("datajs-js-dequeueFunction", function (evt) {\
                    var id = evt.id, name = evt.name;\
                    var queued = queuedFunctions[id];\
                    if (queued) {\
                        var func = queued[name];\
                        if (func) {\
                            func(JSON.parse(evt.arg));\
                            delete queued[name];\
                        }\
                        delete queuedFunctions[id];\
                    }\
                });\
                xhrOverride = function(url, request, success, error) {\
                    lastCallID += 1;\
                    queuedFunctions[lastCallID] = { success: success, error: error };\
                    Ti.App.fireEvent("datajs-ti-handleRequest", { url: url, request: JSON.stringify(request), id: lastCallID });\
                    return null;\
                };\
            </script></head><body></body></html>',
        top: 0, left: 0,
        width: 1, height: 1,
        touchEnabled: false
    });
    setTimeout(ready, 500);
    win.add(web);

    Ti.App.addEventListener('datajs-ti-dequeueFunction', function (evt) {
        var id = evt.id, name = evt.name;
        var queued = queuedFunctions[id];
        if (queued) {
            var func = queued[name];
            if (func) {
                var args = JSON.parse(evt.args);
                func(args[0], args[1], args[2], args[3], args[4], args[5]);
                delete queued[name];
            }
            delete queuedFunctions[id];
        }
    });

    Ti.App.addEventListener('datajs-ti-handleRequest', function (evt) {
        var url = evt.url, id = evt.id, request = JSON.parse(evt.request);
        handleRequest(url, request, function callback(type, response) {
            Ti.App.fireEvent("datajs-js-dequeueFunction", {
                name: type,
                id: id,
                arg: JSON.stringify(response)
            });
        });
    });

    function handleRequest(url, request, callback) {
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
                    body: trim12(this.responseText)
                };
                url = null;
                if (this.status >= 200 && this.status <= 299) {
                    callback('success', response);
                } else {
                    callback('error', { message: "HTTP Request Failed", request: request, response: this.responseText });
                }
                request = null;
            },
            onerror: function () {
                callback('error', { message: "HTTP Request Failed", request: request, response: this.responseText });
                request = null;
            }
        });
        xhr.open(request.method || "GET", url);
        xhr.setRequestHeader("accept", request.accept || "application/json,application/xml,text/html");
        for (var h in request.headers) {
            if (request.headers.hasOwnProperty(h) && h != 'Accept')
                xhr.setRequestHeader(h, request.headers[h]);
        }
        if (request.user) {
            xhr.setRequestHeader("Authorization", "Basic "
                + Ti.Utils.base64encode(request.user + ":" + request.password));
        }
        if (request.method in { PUT: 1, POST: 1, DELETE: 1 }) {
            xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");
            xhr.setRequestHeader("X-requested-with", "XMLHttpRequest");
            xhr.setRequestHeader("X-Request-With", "X");
        }
        xhr.send(request.body || {});
        xhr = null;
    }

    return api;
};

// http://blog.stevenlevithan.com/archives/faster-trim-javascript
function trim12(str) {
    if (!str || str.length <= 0)
        return false;
    var str = str.replace(/^\s\s*/, ''),
        ws = /\s/,
        i = str.length;
    while (ws.test(str.charAt(--i))) {}
    return str.slice(0, i + 1);
}
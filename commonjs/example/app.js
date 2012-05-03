var win = Ti.UI.createWindow({
    backgroundColor: '#fff'
});
win.open();

var baseURL = 'http://appc.me/odata/flocker/';

var DataJS = require('ti.datajs');
var OData = DataJS.init(win, requestList);

var useXMLNotJSON = true;
var dataType = useXMLNotJSON ? 'application/atom+xml' : 'application/json';

function requestList() {
    OData.read({
            requestUri: baseURL,
            accept: dataType
        },
        function (data) {
            Ti.API.info('requestList succeeded.');
            // XML gives us additional metadata. JSON just gives us the results. But URI computation is easy...
            requestDetails(useXMLNotJSON ? data.results[0].__metadata.uri : (baseURL + data.results[0].Id));
        },
        function (err) {
            Ti.API.error('Error occurred ' + JSON.stringify(err));
        }
    );
}

function requestDetails(uri) {
    OData.read({
            requestUri: uri,
            accept: dataType
        },
        function (item) {
            Ti.API.info('requestDetails succeeded.');
            // XML has to wrap the feed in results. JSON gives us the item we requested directly.
            updateItem(useXMLNotJSON ? item.results[0] : item);
        },
        function (err) {
            Ti.API.error('Error occurred ' + JSON.stringify(err));
        }
    );
}

function updateItem(item) {
    // Again, XML gives us additional metadata. But we can compute the necessary URI.
    var uri = useXMLNotJSON ? ((item.__metadata.edit || item.__metadata.uri) + '/PutXML') : (baseURL + item.Id);

    // XML crunches everything to lowercase; JSON uses exactly what the server sends and receives.
    item[useXMLNotJSON ? 'message' : 'Message'] = 'Message at time: ' + new Date().getTime() + 'ms';

    OData.request({
            headers: {
                'Content-Type': dataType
            },
            accept: dataType,
            requestUri: uri,
            method: 'PUT',
            data: item
        },
        function (data) {
            alert('Update succeeded! Check the console for additional information.');
            Ti.API.info(JSON.stringify(data));
        },
        function (err) {
            Ti.API.error('Error occurred ' + JSON.stringify(err));
        }
    );
}
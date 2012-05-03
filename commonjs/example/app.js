var win = Ti.UI.createWindow({
    backgroundColor: '#fff'
});
win.open();

var DataJS = require('ti.datajs');
var OData = DataJS.init(win, requestList);

function requestList() {
    OData.read({
            requestUri: 'http://appc.me/odata/flocker',
            accept: 'application/atom+xml'
        },
        function (data, response) {
            Ti.API.info('requestList succeeded.');
            requestDetails(data.results[0].__metadata.uri);
        },
        function (err) {
            Ti.API.error('Error occurred ' + JSON.stringify(err));
        }
    );
}

function requestDetails(uri) {
    OData.read({
            requestUri: uri,
            accept: 'application/atom+xml'
        },
        function (item, response) {
            Ti.API.info('requestDetails succeeded.');
            updateItem(item.results[0]);
        },
        function (err) {
            Ti.API.error('Error occurred ' + JSON.stringify(err));
        }
    );
}

function updateItem(item) {
    var uri = (item.__metadata.edit || item.__metadata.uri) + '/PutXML';
    Ti.API.info('Current message: ' + item.message);
    item.message = 'Message at time: ' + new Date().getTime() + 'ms';
    Ti.API.info('Changing to: ' + item.message);

    Ti.API.info('uri: ' + uri);

    OData.request({
            headers: {
                'Content-Type': 'application/atom+xml'
            },
            accept: 'application/atom+xml',
            requestUri: uri,
            method: 'PUT',
            data: item
        },
        function (data, response) {
            Ti.API.info('Update succeeded.');
            Ti.API.info(JSON.stringify(data));
        },
        function (err) {
            Ti.API.error('Error occurred ' + JSON.stringify(err));
        }
    );
}
var win = Ti.UI.createWindow({
    backgroundColor: '#fff'
});
var status = Ti.UI.createLabel({
    text: 'Loading, please wait...', textAlign: 'center',
    color: '#000'
});
win.add(status);
win.open();

var baseURL = 'http://appc.me/odata/flocker/';

var DataJS = require('ti.datajs');
var OData = DataJS.init(win, start);

var useXMLNotJSON = false;
var dataType = useXMLNotJSON ? 'application/atom+xml' : 'application/json';

var maxIterations = 50;
var iterationsRemaining;
var startTime;
var intervalID;

function start() {
    iterationsRemaining = maxIterations;
    startTime = new Date().getTime();
    startNext = true;
    intervalID = setInterval(check, 100);
}

function finish() {
    clearInterval(intervalID);
    var time = new Date().getTime() - startTime;
    status.text = (useXMLNotJSON ? 'XML' : 'JSON') + ' Results\n\n' +
        'Total time: ' + time + 'ms!\n\n' +
        'Approx. ' + (time / maxIterations) + 'ms per iteration.';
}

var startNext = false;
function check() {
    if (startNext) {
        startNext = false;
        requestList();
    }
}


function requestList() {
    status.text = iterationsRemaining + ' of ' + maxIterations;
    OData.read({
            requestUri: baseURL,
            accept: dataType
        },
        function (data, response) {
            Ti.API.info('requestList succeeded.');
            // XML gives us additional metadata. JSON just gives us the results. But URI computation is easy...
            requestDetails(useXMLNotJSON ? data.results[0].__metadata.uri : (baseURL + data.results[0].Id));
            
            Ti.API.info(JSON.stringify(data));
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
        function (item, response) {
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

    Ti.API.info(JSON.stringify(item));

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
        function (data, response) {
            Ti.API.info(iterationsRemaining + ': Update succeeded! Check the console for additional information.');
            Ti.API.info(JSON.stringify(data));
            iterationsRemaining -= 1;
            if (iterationsRemaining > 0) {
                startNext = true;
            }
            else {
                finish();
            }
        },
        function (err) {
            Ti.API.error('Error occurred ' + JSON.stringify(err));
        }
    );
}
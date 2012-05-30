# Ti.DataJS Module

## Desription

Provides access to OData feeds by utilizing Microsoft's DataJS JavaScript library through Titanium.
DataJS makes it easy to interact with OData through XML or JSON.

## Note:

This module requires that you are using version 2.0.2 or newer of the Titanium SDK.

## OData Resources

Visit the [SAP NetWeaver Gateway][sapnetweavergateway] website for details on the SAP OData technology. There are a number
of informative documents that may be helpful in getting started with accessing SAP technologies.

## Getting Started

View the [Using Titanium Modules](http://docs.appcelerator.com/titanium/2.0/#!/guide/Using_Titanium_Modules) document for instructions on getting
started with using this module in your application.

## Accessing the Module

To access this module from JavaScript, you would do the following:

	var DataJS = require("ti.datajs");

The DataJS variable is a reference to the Module object.

## Methods

### void OData.read(urlOrRequest, success, error, handler, httpClient, metadata)
Reads data from the specified OData URL. Please see the [DataJS documentation for OData.read][datajsread] to learn more.

* urlOrRequest[string or object]: A string containing the URL to which the request is sent, or an object that represents the HTTP request to be sent
* success[function]: A callback function that is executed if the request succeeds (optional). Parameters passed to the callback function are:
    * data[object]: Processed data
    * response[object]: Server response
* error[function]: A callback function that is executed if the request fails (optional). Parameters passed to the callback function are:
    * err[object]: Error object
* handler[function]: Handler for data serialization (optional)
* httpClient[object]: Object to use as an HTTP stack (optional)
* metadata[object]: Object describing the structural metadata to use (optional)

#### Example
    DataJS.OData.read({
            requestUri: baseURL,
            headers: {
                Accept: 'application/atom+xml'
            }
        },
        function (data, response) {
            Ti.API.info(JSON.stringify(data));
        },
        function (err) {
            Ti.API.error('Error occurred ' + JSON.stringify(err));
        }

### void OData.request(request, success, error, handler, httpClient, metadata)
Sends a request containing OData payload to the server. Please see the [DataJS documentation for OData.request][datajsrequest] to learn more.

* request[object]: An object that represents the HTTP request to be sent
* success[function]: A callback function that is executed if the request succeeds (optional). Parameters passed to the callback function are:
    * data[object]: Processed data
    * response[object]: Server response
* error[function]: A callback function that is executed if the request fails (optional). Parameters passed to the callback function are:
    * err[object]: Error object
* handler[function]: Handler for data serialization (optional)
* httpClient[object]: Object to use as an HTTP stack (optional)
* metadata[object]: Object describing the structural metadata to use (optional)

#### Example
    DataJS.OData.request({
            requestUri: uri,
            headers: {
                'Content-Type': 'application/atom+xml',
                Accept: 'application/atom+xml'
            },
            method: 'PUT',
            data: item
        },
        function (data, response) {
            Ti.API.info(JSON.stringify(data));
        },
        function (err) {
            Ti.API.error('Error occurred ' + JSON.stringify(err));
        }
    );

### object datajs.createDataCache(options)
The datajs cache API provides a very simple way of reading large paginated results in an efficient way that is very responsive
to the needs of the user interface. Please see the [DataJS documentation for the datajs cache API][datajsdatacache] to learn more.
This method returns the cache object that is used for accessing the cache methods described in the documentation.

* options[object]: An object that specifies configuration options for the data cache. The 'name' and 'source' properties are required.

#### Example
    // Create a cache for reading a large collection of data
	var flightCollectionCache = DataJS.datajs.createDataCache({
		name: 'flightCollectionCache',
		source: flightCollectionURL,
		pageSize: pageSize,
		headers: { Accept: dataType },
		formatQueryString: queryString,
		user: credentials.user,
		password: credentials.password,
	});

	// Read a page from the cache
    flightCollectionCache.readRange(row, pageSize).then(
        function (data, response) {
            if (typeof success === "function") {
                success(data);
            }
        },
        function (err) {
            if (typeof error === "function") {
                error(err);
            }
        }
    );

### object datajs.createStore(name, mechanism)
The datajs store API provides a common abstraction over a few mechanisms that can be uesd to store data. Please see the
[DataJS documentation for the datajs store API][datajsdatastore] to learn more.
This method returns the store object that is used for accessing the store methods described in the documentation.

* name[string]: Name for the data store
* mechanism[string]: Mechanism to use to create the store (options). Valid values include:
    * "best"
    * "memory"
    * "dom"
    * "indexeddb"

#### Example
    // Create a store for saving key/value pairs
    var flightStore = DataJS.datajs.createStore("flightData");
    flightStore.add(
        key,
        value,
        function (key, value) {
            Ti.API.info(JSON.stringify(data));
        },
        function (err) {
            Ti.API.error('Error occurred ' + JSON.stringify(err));
        }
    );

## Usage
See the example applications in the 'example' folder of the module.

The first example application, SAPFlight, demonstrates how to retrieve
data from the SAP Flight Collection data feed. The code for accessing the data feed is located in
the 'example/SAPFlight/data/datalayer.js' file. This example uses the 'atom+xml' data format.
Note that this example application does not work on MobileWeb due to issues with CORS.

The second example, Netflix, demonstrates how to retrieve data from the
NetFlix data feed. The code for accessing the data feed is located in the
'example/NetFlix/data/datalayer.js' file. This example uses the 'json' data format via JSONP to retrieve data.
Note that this example application does work on MobileWeb.

Both example applications make use of the data cache capabilities of the module to retrieve data one page at a time. This
technique is used in implementing the 'infinite-scroll', or 'pull-to-load' feature of the application.

## Author

Dawson Toth and Jeff English

## Module History

View the [change log](changelog.html) for this module.

## Feedback and Support

Please direct all questions, feedback, and concerns to [info@appcelerator.com](mailto:info@appcelerator.com?subject=Ti.DataJS%20Module).

## License

Copyright(c) 2011-2012 by Appcelerator, Inc. All Rights Reserved. Please see the LICENSE file included in the distribution for further details.

[datajs]: http://datajs.codeplex.com/
[datajsread]: http://datajs.codeplex.com/wikipage?title=datajs%20OData%20API#OData.read
[datajsrequest]: http://datajs.codeplex.com/wikipage?title=datajs%20OData%20API#OData.request
[datajsdatacache]: http://datajs.codeplex.com/wikipage?title=datajs%20cache%20API
[datajsdatastore]: http://datajs.codeplex.com/wikipage?title=datajs%20store%20API
[sapnetweavergateway]: http://scn.sap.com/community/netweaver-gateway
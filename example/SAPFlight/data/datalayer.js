/*
 * This module implements a simple data layer for the application, utilizing the
 * Ti.SAP.OData module for OData access.
 */

(function (datalayer) {
    // The Ti.SAP.OData module provides a simplified interface for accessing OData via JavaScript.
	var SAPOData = require('ti.sap.odata');

    // Select the format for the OData feed that is being used. In this case, we are going
    // to use the XML atom format from the feed. If your data feed supports JSON then specify
    // the JSON format as it will usually be more performant than XML data feeds.
	var useXMLNotJSON = true;
	var dataType = useXMLNotJSON ? 'application/atom+xml' : 'application/json';
	var queryString = '$format=xml';

    // This module supports the ability to request all of the data at once or page-by-page.
    // When in paging mode, this value specifies the number of rows to be retrieved on each page request.
	var pageSize = 20;

    // Specify the URL for the sample flight data feed
	var baseURL = 'http://gw.esworkplace.sap.com/sap/opu/odata/IWBEP/RMTSAMPLEFLIGHT_2';
	var flightCollectionURL = baseURL + '/FlightCollection/';

    // Name of file for persisting a retrieved flight collection
    var flightCollectionFile = 'flightcollection.dat';

    // The sample flight data feeds require a username and password. For the purposes of
    // this example, the user and password are hard-coded -- this information would normally
    // be retrieved from the user via a login screen or some form of external credentials storage.
	var credentials = {
		user: 'GW@ESW',
		password: 'ESW4GW'
	};

    // To support the paging mode, create a data cache that will perform all of the
    // background work for retrieving each page of data. This is an optional feature of
    // the Ti.SAP.OData module and is not required for OData usage, but is very helpful for
    // implementing 'infinite-scrolling' in the user-interface.
	var flightCollectionCache = SAPOData.datajs.createDataCache({
		name: 'flightCollectionCache',
		source: flightCollectionURL,
		pageSize: pageSize,
		headers: { Accept: dataType },
		formatQueryString: queryString,
		user: credentials.user,
		password: credentials.password
	});

    // Public method for clearing the data cache
	datalayer.clearFlightCollectionCache = function () {
		flightCollectionCache.clear();
	}

    // Public method for retrieving a page of data. This method makes use of the data cache
    // mechanism of the Ti.SAP.OData module.
    //   row: The index of the first row to retrieve
    //   success: callback function to be notified when data has been retrieved
    //   error: callback function to be notified if an error occurs during retrieval
	datalayer.getFlightCollectionRows = function (row, success, error) {
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
	}
	
    // Public method for retrieving the entire collection of data. This method makes use of
    // the standard OData request mechanism of the Ti.SAP.OData module.
    //   success: callback function to be notified when data has been retrieved
    //   error: callback function to be notified if an error occurs during retrieval
	datalayer.getFlightCollection = function (success, error) {
		SAPOData.OData.read({
    	        requestUri: flightCollectionURL,
        	    headers: { Accept: dataType },
				formatQueryString: queryString,
     	       	user: credentials.user,
      	    	password: credentials.password
       		},
        	function (data, response) {
        		if (typeof success === "function") {
        			success(data.results);
        		}
       		},
        	function (err) {
        		if (typeof error === "function") {
        			error(err);
        		}
        	}
    	);
	};	

    // Public method for loading a cached collection of flight data.
    datalayer.loadFlightCollectionFromFile = function () {
		var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, flightCollectionFile);
		if (file.exists()) {
			var data = file.read();
			return JSON.parse(data);
		}
		
		return null;
	}

    // Public method for persisting a collection of flight data. This would be useful
    // if you need to support accessing the data when there is no network connectivity or
    // you want to reload data from a previous session without having to make the OData
    // request.
    datalayer.saveFlightCollectionToFile = function (data) {
		var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, flightCollectionFile);
		file.write(JSON.stringify(data, false));
	}
})(exports);


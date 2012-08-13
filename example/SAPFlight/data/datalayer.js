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

    // The sample flight data feeds require a username and password. For the purposes of
    // this example, the user and password are hard-coded -- this information would normally
    // be retrieved from the user via a login screen or some form of external credentials storage.
	var credentials = {
		user: 'GW@ESW',
		password: 'ESW4GW'
	};

	// Non-cached flight data
	var flightCollection = null;

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

	// Public property to manage page caching
	datalayer.pageMode = true;

    // Public method for clearing the data cache
	datalayer.clearFlightCollectionCache = function () {
		flightCollectionCache.clear();
		flightCollection = null;
	}

	// Public method for retrieving a single row by index. If using paging mode then
	// request the row from the data cache. Otherwise, return the row directly from
	// the local collection.
    //   success: callback function to be notified when data has been retrieved
    //   error: callback function to be notified if an error occurs during retrieval
	datalayer.getFlight = function (row, success, error) {
		if (this.pageMode) {
			flightCollectionCache.readRange(row, 1).then(
				function (data, response) {
					if (typeof success === "function") {
						success(data[0]);
					}
				},
				function (err) {
					if (typeof error === "function") {
						error(err);
					}
				}
			);
		} else if ((row >= 0) && (row < flightCollection.length)) {
			if (typeof success === "function") {
				success(flightCollection[row]);
			}
		} else {
			if (typeof error === "function") {
				error("Requested row is out of range");
			}
		}
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
        			flightCollection = data && data.results;
        			success(flightCollection);
        		}
       		},
        	function (err) {
        		if (typeof error === "function") {
        			error(err);
        		}
        	}
    	);
	};	
})(exports);


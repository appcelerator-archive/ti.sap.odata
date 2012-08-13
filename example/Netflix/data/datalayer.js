/*
 * This module implements a simple data layer for the application, utilizing the
 * Ti.SAP.OData module for OData access.
 */

(function (datalayer) {
    // The Ti.SAP.OData module provides a simplified interface for accessing OData via JavaScript.
	var SAPOData = require('ti.sap.odata');

    // Select the format for the OData feed that is being used. In this case, we are going
    // to use the JSON format from the feed.
	var dataType = 'application/json';

    // Specify the URL for the sample Netflix data feed
    var baseURL = "http://odata.netflix.com/Catalog/Genres";

    // This module supports the ability to request all of the data at once or page-by-page.
    // When in paging mode, this value specifies the number of rows to be retrieved on each page request.
	var pageSize = 20;

	// Non-cached genres data
	var genresCollection = null;

    // To support the paging mode, create a data cache that will perform all of the
    // background work for retrieving each page of data. This is an optional feature of
    // the Ti.SAP.OData module and is not required for OData usage, but is very helpful for
    // implementing 'infinite-scrolling' in the user-interface.
	var genresCollectionCache = SAPOData.datajs.createDataCache({
		name: 'genresCollectionCache',
		source: baseURL,
		pageSize: pageSize,
		headers: { Accept: dataType },
        enableJsonpCallback: true
	});

	// Public property to manage page caching
	datalayer.pageMode = true;

    // Public method for clearing the data cache
	datalayer.clearGenresCollectionCache = function () {
		genresCollectionCache.clear();
		genresCollection = null;
	}

	// Public method for retrieving a single row by index. If using paging mode then
	// request the row from the data cache. Otherwise, return the row directly from
	// the local collection.
    //   success: callback function to be notified when data has been retrieved
    //   error: callback function to be notified if an error occurs during retrieval
	datalayer.getGenre = function (row, success, error) {
		if (this.pageMode) {
			genresCollectionCache.readRange(row, 1).then(
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
		} else if ((row >= 0) && (row < genresCollection.length)) {
			if (typeof success === "function") {
				success(genresCollection[row]);
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
	datalayer.getGenresCollectionRows = function (row, success, error) {
		genresCollectionCache.readRange(row, pageSize).then(
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

    // To support the paging mode, create a data cache that will perform all of the
    // background work for retrieving each page of data. This is an optional feature of
    // the Ti.SAP.OData module and is not required for OData usage, but is very helpful for
    // implementing 'infinite-scrolling' in the user-interface.
    var detailsCollectionCache = null;

    datalayer.initDetailsCollectionCache = function (URL) {
        if (detailsCollectionCache != null) {
            detailsCollectionCache.clear();
        }
        detailsCollectionCache = SAPOData.datajs.createDataCache({
		    name: 'detailsCollectionCache',
            source: URL + "?$orderby=Name",
		    pageSize: pageSize,
		    headers: { Accept: dataType },
            enableJsonpCallback: true
        });
    }

    // Public method for retrieving a page of data. This method makes use of the data cache
    // mechanism of the Ti.SAP.OData module.
    //   row: The index of the first row to retrieve
    //   success: callback function to be notified when data has been retrieved
    //   error: callback function to be notified if an error occurs during retrieval
	datalayer.getDetailsCollectionRows = function (row, success, error) {
		detailsCollectionCache.readRange(row, pageSize).then(
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

    // Public method for retrieving the entire collection of genres. This method makes use of
    // the standard OData request mechanism of the Ti.SAP.OData module.
    //   success: callback function to be notified when data has been retrieved
    //   error: callback function to be notified if an error occurs during retrieval
	datalayer.getGenres = function (success, error) {
		SAPOData.OData.read({
    	        requestUri: baseURL,
        	    headers: { Accept: dataType },
                enableJsonpCallback: true
       		},
        	function (data, response) {
        		if (typeof success === "function") {
			        genresCollection = data && data.results;
        			success(genresCollection);
        		}
       		},
        	function (err) {
        		if (typeof error === "function") {
        			error(err);
        		}
        	}
    	);
	};

    // Public method for retrieving the details for a genre. This method makes use of
    // the standard OData request mechanism of the Ti.SAP.OData module.
    //   success: callback function to be notified when data has been retrieved
    //   error: callback function to be notified if an error occurs during retrieval
	datalayer.getDetails = function (URL, success, error) {
		SAPOData.OData.read({
    	        requestUri: URL,
        	    headers: { Accept: dataType },
                enableJsonpCallback: true
       		},
        	function (data, response) {
        		if (typeof success === "function") {
        			success(data && data.results);
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


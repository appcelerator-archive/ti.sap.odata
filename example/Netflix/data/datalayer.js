/*
 * This module implements a simple data layer for the application, utilizing the
 * dataJS module for oData access.
 */

(function (datalayer) {
    // The dataJS module provides a simplified interface for accessing oData via JavaScript.
	var DataJS = require('ti.datajs');

    // Select the format for the oData feed that is being used. In this case, we are going
    // to use the JSON format from the feed.
	var dataType = 'application/json';

    // Specify the URL for the sample Netflix data feed
    var baseURL = "http://odata.netflix.com/Catalog/Genres";

    // This module supports the ability to request all of the data at once or page-by-page.
    // When in paging mode, this value specifies the number of rows to be retrieved on each page request.
	var pageSize = 20;

    // To support the paging mode, create a data cache that will perform all of the
    // background work for retrieving each page of data. This is an optional feature of
    // the dataJS module and is not required for oData usage, but is very helpful for
    // implementing 'infinite-scrolling' in the user-interface.
	var genresCollectionCache = DataJS.datajs.createDataCache({
		name: 'genresCollectionCache',
		source: baseURL,
		pageSize: pageSize,
		headers: { Accept: dataType },
        enableJsonpCallback: true
	});

    // Public method for clearing the data cache
	datalayer.clearGenresCollectionCache = function () {
		genresCollectionCache.clear();
	}

    // Public method for retrieving a page of data. This method makes use of the data cache
    // mechanism of the dataJS module.
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
    // the dataJS module and is not required for oData usage, but is very helpful for
    // implementing 'infinite-scrolling' in the user-interface.
    var detailsCollectionCache = null;

    datalayer.initDetailsCollectionCache = function (URL) {
        if (detailsCollectionCache != null) {
            detailsCollectionCache.clear();
        }
        detailsCollectionCache = DataJS.datajs.createDataCache({
		    name: 'detailsCollectionCache',
            source: URL + "?$orderby=Name",
		    pageSize: pageSize,
		    headers: { Accept: dataType },
            enableJsonpCallback: true
        });
    }

    // Public method for retrieving a page of data. This method makes use of the data cache
    // mechanism of the dataJS module.
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
    // the standard oData request mechanism of the dataJS module.
    //   success: callback function to be notified when data has been retrieved
    //   error: callback function to be notified if an error occurs during retrieval
	datalayer.getGenres = function (success, error) {
	    DataJS.OData.read({
    	        requestUri: baseURL,
        	    headers: { Accept: dataType },
                enableJsonpCallback: true
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

    // Public method for retrieving the details for a genre. This method makes use of
    // the standard oData request mechanism of the dataJS module.
    //   success: callback function to be notified when data has been retrieved
    //   error: callback function to be notified if an error occurs during retrieval
	datalayer.getDetails = function (URL, success, error) {
	    DataJS.OData.read({
    	        requestUri: URL,
        	    headers: { Accept: dataType },
                enableJsonpCallback: true
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

})(exports);


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


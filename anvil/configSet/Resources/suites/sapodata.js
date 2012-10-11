/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function () {
    var finish;
    var valueOf;
    var SAPOData;
    var testForGitPush;
    this.init = function (testUtils) {
        finish = testUtils.finish;
        valueOf = testUtils.valueOf;
        SAPOData = require('ti.sap.odata');
    };

    this.name = "sapodata";

    // Test that module is loaded
    this.testModule = function (testRun) {
        // Verify that the module is defined
        valueOf(testRun, SAPOData).shouldBeObject();
        finish(testRun);
    };

    // Test that all of the namespace APIs are available
    this.testApi = function(testRun) {
        // Verify that all of the methods are exposed
	    valueOf(testRun, SAPOData.OData.read).shouldBeFunction();
	    valueOf(testRun, SAPOData.OData.request).shouldBeFunction();
	    valueOf(testRun, SAPOData.datajs.createDataCache).shouldBeFunction();
	    valueOf(testRun, SAPOData.datajs.createStore).shouldBeFunction();
        finish(testRun);
    };

    // Test that all of the properties are defined
    this.testProperties = function(testRun) {
        // Verify that all of the properties are exposed
        valueOf(testRun, SAPOData.OData.defaultSuccess).shouldBeFunction();
	    valueOf(testRun, SAPOData.OData.defaultError).shouldBeFunction();
	    valueOf(testRun, SAPOData.OData.defaultHttpClient).shouldBeObject();
	    valueOf(testRun, SAPOData.OData.defaultHttpClient.request).shouldBeFunction();
        finish(testRun);
    };

    // Test that all of the constants are defined
    this.testConstants = function(testRun) {
        // Verify that all of the constants are exposed
        finish(testRun);
    };

    // Test that all of the methods of the dataStore are defined
    this.testStoreApi = function (testRun) {
	    var finished = function(e) {
		    finish(testRun);
	    }
		var store = SAPOData.datajs.createStore('testStore');
	    valueOf(testRun, store).shouldBeObject();
	    valueOf(testRun, store.add).shouldBeFunction();
	    valueOf(testRun, store.addOrUpdate).shouldBeFunction();
	    valueOf(testRun, store.clear).shouldBeFunction();
	    valueOf(testRun, store.close).shouldBeFunction();
	    valueOf(testRun, store.contains).shouldBeFunction();
	    valueOf(testRun, store.defaultError).shouldBeFunction();
	    valueOf(testRun, store.getAllKeys).shouldBeFunction();
	    valueOf(testRun, store.read).shouldBeFunction();
	    valueOf(testRun, store.update).shouldBeFunction();
	    valueOf(testRun, store.remove).shouldBeFunction();
		store.close();
	    store.clear(finished);
    };

	this.testDataCacheApi = function (testRun) {
		var myIdleFunction = function() {};
		var cache = SAPOData.datajs.createDataCache({
			name: 'testCache',
			source: 'http://odata.netflix.com/Catalog/Genres',
			idle: myIdleFunction
		});
		valueOf(testRun, cache).shouldBeObject();
		valueOf(testRun, cache.readRange).shouldBeFunction();
		valueOf(testRun, cache.toObservable).shouldBeFunction();
		valueOf(testRun, cache.count).shouldBeFunction();
		valueOf(testRun, cache.clear).shouldBeFunction();
		valueOf(testRun, cache.onidle).shouldBeFunction();
		valueOf(testRun, cache.onidle).shouldBe(myIdleFunction);
		finish(testRun);
	};

	this.testReadJSON = function (testRun) {
		SAPOData.OData.read({
    	        requestUri: "http://odata.netflix.com/Catalog/Genres",
        	    headers: { Accept: "application/json" },
                enableJsonpCallback: true
       		},
        	function (data, response) {
		        valueOf(testRun, data.results).shouldBeObject();
		        finish(testRun);
       		},
        	function (err) {
		        valueOf(testRun, false).shouldBeTrue();
        	}
    	);
	};

	// NOTE: This test currently does not run on MobileWeb due to CORS issues
	this.testReadXML = function (testRun) {
		SAPOData.OData.read({
                requestUri: "http://gw.esworkplace.sap.com/sap/opu/odata/IWBEP/RMTSAMPLEFLIGHT_2/FlightCollection/",
                headers: { Accept: "application/atom+xml" },
				formatQueryString: "$format=xml",
                user: "GW@ESW",
                password: "ESW4GW"
            },
            function (data, response) {
				valueOf(testRun, data.results).shouldBeObject();
	            finish(testRun);
            },
            function (err) {
                valueOf(testRun, false).shouldBeTrue();
            }
        );
	}
	this.testReadXML.platforms = { android:1, iphone:1, ipad:1, mobileweb:0 }

	// Populate the array of tests based on the 'hammer' convention
	this.tests = require('hammer').populateTests(this);
}

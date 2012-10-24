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
    var bookingData;
    var credentials = {
        user : 'P1469806669',
        password : 'dashboard'
    };
    this.init = function (testUtils) {
        finish = testUtils.finish;
        valueOf = testUtils.valueOf;
        SAPOData = require('ti.sap.odata');

        SAPOData.OData.read({
            requestUri : 'http://gw.esworkplace.sap.com/sap/opu/sdata/iwfnd/RMTSAMPLEFLIGHT/FlightCollection/',
            headers : {
                "X-Requested-With" : "XMLHttpRequest",
                "Content-Type" : "application/atom+xml",
                "DataServiceVersion" : "2.0",
                "Accept" : 'application/atom+xml'
            },
            formatQueryString : "$format=xml",
            user : 'P1469806669',
            password : 'dashboard'
        }, function(data, response) {


            for (var i=0; i<data.results.length; i++) {
                var item = data.results[i];
                delete item['__metadata'];
                var today = Date();
                var td = today.split(' ');
                var fd = item.fldate;
                var fy = fd.getFullYear();

                if (fy > td[3]){
                    carridx = item.carrid;
                    connidx = item.connid;
                    fldatex = item.fldate;


                    bookingData = {
                        AGENCYNUM : "00000325",
                        CANCELLED : "",
                        CLASS : "Y",
                        COUNTER : "00000000",
                        CUSTOMID : "00004617",
                        CUSTTYPE : "P",
                        FORCURAM : 879.82,
                        FORCURKEY : "USD",
                        INVOICE : "",
                        LOCCURAM : 803.58,
                        LOCCURKEY : "USD",
                        LUGGWEIGHT : 27.54321,
                        ORDER_DATE : "2011-05-22T00:00:00",
                        PASSBIRTH : "1990-10-10T00:00:00",
                        PASSFORM : 1234567,
                        PASSNAME : "itest1",
                        RESERVED : "",
                        SMOKER : "",
                        WUNIT : "KGM",
                        bookid : "",
                        // choose future flight
                        carrid : carridx, //"UA",//"AA",//http://gw.esworkplace.sap.com/sap/opu/sdata/iwfnd/RMTSAMPLEFLIGHT/FlightCollection/
                        connid : connidx, //"3517",//"0017",//args.flight.connid,
                        fldate : fldatex  //"2013-04-22T00:00:00"//"2012-03-07T00:00:00"
                    };

                    break;
                };
            }

        }, function(err) {
            valueOf(testRun, false).shouldBeTrue();
        });


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
	};

    // Test Request POST****************************************************************************
    // createItem


    this.testRequestPOST_createItem = function (testRun) {


        var uri = "http://gw.esworkplace.sap.com/sap/opu/sdata/iwfnd/RMTSAMPLEFLIGHT" + '/BookingCollection';

        SAPOData.OData.request({
            requestUri : uri,
            headers : {
                "X-Requested-With" : "XMLHttpRequest",
                "Content-Type" : "application/atom+xml",
                "DataServiceVersion" : "2.0"
            },
            method : 'POST',
            formatQueryString : "$format=xml",
            data : bookingData,
            user : credentials.user,
            password : credentials.password
        },
            function (data, response) {
                valueOf(testRun, data).shouldBeObject();
                finish(testRun);
            },
            function (err) {
                alert(err);
                //valueOf(testRun, false).shouldBeTrue();
            }
        );
    };

    // Test Request PUT****************************************************************************
    // updateItem

    this.testRequestPUT_updateItem = function (testRun) {


        var uri = "http://gw.esworkplace.sap.com/sap/opu/sdata/iwfnd/RMTSAMPLEFLIGHT" + '/BookingCollection';

        SAPOData.OData.request({
                requestUri : uri,
                headers : {
                    "X-Requested-With" : "XMLHttpRequest",
                    "Content-Type" : "application/atom+xml",
                    "DataServiceVersion" : "2.0"
                },
                method : 'POST',
                formatQueryString : "$format=xml",
                data : bookingData,
                user : credentials.user,
                password : credentials.password
            },
            function (data, response) {
                var updatedItem = data;
                var uri = data.__metadata.edit;
                updatedItem.PASSNAME = "iTest2";

                SAPOData.OData.request({
                    headers : {
                        "X-Requested-With" : "XMLHttpRequest",
                        "Content-Type" : "application/atom+xml",
                        "DataServiceVersion" : "2.0"
                    },
                    requestUri: uri,
                    method: 'PUT',
                    formatQueryString : "$format=xml",
                    data : updatedItem,
                    user : credentials.user,
                    password : credentials.password
                }, function (data, response) {
                        valueOf(testRun, response).shouldBeObject();
                        finish(testRun);
                }, 	function (err) {

                        valueOf(testRun, false).shouldBeTrue();
                });

            },
            function (err) {

                valueOf(testRun, false).shouldBeTrue();
            }
        );
    };

    // Test Read ****************************************************************************
    // getItem

    this.testRead_getItem = function (testRun) {


        var uri = "http://gw.esworkplace.sap.com/sap/opu/sdata/iwfnd/RMTSAMPLEFLIGHT" + '/BookingCollection';

        SAPOData.OData.request({
                requestUri : uri,
                headers : {
                    "X-Requested-With" : "XMLHttpRequest",
                    "Content-Type" : "application/atom+xml",
                    "DataServiceVersion" : "2.0"
                },
                method : 'POST',
                formatQueryString : "$format=xml",
                data : bookingData,
                user : credentials.user,
                password : credentials.password
            },
            function (data, response) {
                var item = data;
                var uri = item.__metadata.uri;

                SAPOData.OData.read({
                    headers : {
                        "X-Requested-With" : "XMLHttpRequest",
                        "Content-Type" : "application/atom+xml",
                        "DataServiceVersion" : "2.0"
                    },
                    requestUri: uri,
                    formatQueryString: "$format=xml",
                    user : credentials.user,
                    password : credentials.password
                }, function (data, response) {
                        valueOf(testRun, data).shouldBeObject();
                        finish(testRun);
                }, 	function (err) {
                        valueOf(testRun, false).shouldBeTrue();
                });

            },
            function (err) {

                valueOf(testRun, false).shouldBeTrue();
            }
        );

    };


    // Test Request DELETE ****************************************************************************
    // deleteItem
    this.testRequest_deleteItem = function (testRun) {


    var uri = "http://gw.esworkplace.sap.com/sap/opu/sdata/iwfnd/RMTSAMPLEFLIGHT" + '/BookingCollection';

    SAPOData.OData.request({
            requestUri : uri,
            headers : {
                "X-Requested-With" : "XMLHttpRequest",
                "Content-Type" : "application/atom+xml",
                "DataServiceVersion" : "2.0"
            },
            method : 'POST',
            formatQueryString : "$format=xml",
            data : bookingData,
            user : credentials.user,
            password : credentials.password
        },
        function (data, response) {
            var item = data;
            var uri = item.__metadata.uri;

            SAPOData.OData.read({
                headers : {
                    "X-Requested-With" : "XMLHttpRequest",
                    "Content-Type" : "application/atom+xml",
                    "DataServiceVersion" : "2.0"
                },
                requestUri: uri,
                formatQueryString: "$format=xml",
                user : credentials.user,
                password : credentials.password
            }, function (data, response) {
                        //alert('z');
                        var uri = data.__metadata.edit;
                        SAPOData.OData.request({
                            headers : {
                                "X-Requested-With" : "XMLHttpRequest",
                                "Content-Type" : "application/atom+xml",
                                "DataServiceVersion" : "2.0"
                            },
                            requestUri: uri,
                            method: 'DELETE',
                            formatQueryString : "$format=xml",
                            user : credentials.user,
                            password : credentials.password
                        }, function (data, response) {
                                valueOf(testRun, response).shouldBeObject();
                                finish(testRun);
                        }, function (err) {
                                valueOf(testRun, false).shouldBeTrue();
                        });


            }, 	function (err) {
                valueOf(testRun, false).shouldBeTrue();
            });

        },
        function (err) {

            valueOf(testRun, false).shouldBeTrue();
        }
    );

};



 //    Create a cache for reading a large collection of data
    this.testCreateDataCacheAndRead = function (testRun) {

        var uri = "http://gw.esworkplace.sap.com/sap/opu/sdata/iwfnd/RMTSAMPLEFLIGHT/FlightCollection/";
        var pageSize = 1;
        var row = 0;


        var flightCollectionCache = SAPOData.datajs.createDataCache({
            name: 'flightCollectionCache',
            source: uri,
            pageSize: pageSize,
            headers: { Accept: 'application/atom+xml' },
            formatQueryString : "$format=xml",
            user: credentials.user,
            password: credentials.password
            });

    // Read a page from the cache
        flightCollectionCache.readRange(row, pageSize).then(
            function (data, response) {
                valueOf(testRun, data).shouldBeObject();
                finish(testRun);
            },
            function (err) {
                valueOf(testRun, false).shouldBeTrue();
            }
        );
    };



    // Create a store for saving key/value pairs
    this.testCreateStore = function (testRun) {
        var key = 'test101912';
        var value = 'test';
        var flightStore = SAPOData.datajs.createStore("flightData");
        flightStore.add(
            key,
            value,
            function (key, value) {
                valueOf(testRun, key).shouldBe('test101912');
                valueOf(testRun, value).shouldBe('test');
                finish(testRun);
            },
            function (err) {
                valueOf(testRun, false).shouldBeTrue();
            }
        );


    };







	this.testReadXML.platforms = { android:1, iphone:1, ipad:1, mobileweb:0 }

	// Populate the array of tests based on the 'hammer' convention
	this.tests = require('hammer').populateTests(this);
}

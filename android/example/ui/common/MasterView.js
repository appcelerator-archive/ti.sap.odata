/*
 * Master View Component Constructor
 */

function MasterView(win) {
    // Declare required modules
	var Utils = require('utility/utils');
	var DataLayer = require('data/datalayer');
	var Platform = require('utility/platform');

    // Initial state will be paging mode. Each request will be for a page of data from the flight
    // data feed and 'infinite-scrolling' will request the pages as they are needed. When paging mode
    // is turned off the entire collection of flight data will be requested.
	var pageMode = true;

    // Keep track of the index of the last flight record that has been retrieved so that 'infinite-scrolling'
    // can detect when it needs to request the next page.
	var lastFlight = 0;
		
	var self = Ti.UI.createView({
		backgroundColor:'white'
	});

	var table = Ti.UI.createTableView({});
	var modeButton = Ti.UI.createButton({
		title: 'Load All'
	});

    // On iOS platforms we can use the right navigation button to present the mode toggle button.
    // On other platforms we create a button above the table view.
	if (Platform.isiOS) {
		win.rightNavButton = modeButton;
	} else {
		modeButton.top = 5;
		modeButton.width = 200;
		table.top = 60;
		self.add(modeButton);
	}
	self.add(table);

    // Set up the event listeners
	// Notify the application when a flight is selected
	table.addEventListener('click', function(e) {
		self.fireEvent('app:flightSelected', {
			flight: e.rowData.flight
		});
	});
		
	modeButton.addEventListener('click', toggleMode);

    // Trigger a 'refresh' when the window initially opens
	win.addEventListener('open', refresh);

    // Define the template for each row in the table view
	function TableViewCell (flight) {
		var row = Ti.UI.createTableViewRow({
			hasChild: true,
			className: 'FlightItem',
			flight: flight
		});
		
		var title = Ti.UI.createLabel({
			text: flight.AirLineID + " " + flight.FlightConnectionID,
			font: { fontWeight: 'bold', fontSize:14 },
			top: 4, left: 4, width: 'auto', height: 'auto'
		});
		var fromTo = Ti.UI.createLabel({
			text: flight.FlightDetails.DepartureAirPort + " to " + flight.FlightDetails.DestinationAirPort,
			color: 'gray',
			font: { fontSize: 12 },
			top: 22, left: 4, width: 'auto', height: 'auto'
		});
		var dateTime = Ti.UI.createLabel({
			text: Utils.formatDate(flight.FlightDate),
			color: 'gray',
			font: { fontSize: 12 },
			top: 38, left: 4, width: 'auto', height: 'auto'
		});
		var fare = Ti.UI.createLabel({
			text: "$ " + flight.AirFare,
			color: 'gray',
			font: { fontSize: 12 },
			top: 4, right: 4, width: 'auto', height: 'auto'
		});
		
		row.add(title);
		row.add(fromTo);
		row.add(dateTime);
		row.add(fare);
		
		return row;
	}
	
	function toggleMode () {
		pageMode = !pageMode;
		modeButton.title = pageMode ? 'Load All' : 'Paging';
		// Release the cache used for paging mode
		DataLayer.clearFlightCollectionCache();
		refresh ();
	}
	
	function refresh () {
		startLoading ();
		lastFlight = 0;
		populate();
		enableInfiniteScroll(pageMode);
	}	
	
	function handleScroll (evt) {
		// NOTE: Don't use evt.totalItemCount as these event can be queued up and the item count
		// may not have been updated yet. So use our internal count.
	    if ((Utils.isAndroid && (lastFlight < evt.firstVisibleItem + evt.visibleItemCount + 3)) ||
	    	(!Utils.isAndroid && (evt.contentOffset.y + evt.size.height + 100 > evt.contentSize.height))) {
			if (modeButton.enabled) {
				populate();
			}
		}
	}
	function enableInfiniteScroll (enabled) {
		if (enabled) {
			table.addEventListener('scroll', handleScroll);
		} else {
			table.removeEventListener('scroll', handleScroll);	
		}
	}
	
    function startLoading () {
		table.setData([Ti.UI.createTableViewRow({title:"Loading..."})]);
    }
    
    function stopLoading () {
    	table.deleteRow(0);
    }	
    
	function populate () {
		function handleSuccess (flightCollection) {
			// Create each of the cells from the collection of flights
			var tableCells = [];
			var numFlights = flightCollection.length;
			for (var i = 0; i < numFlights; i++) {
				tableCells.push(TableViewCell(flightCollection[i]));
			}
			
			// Now update the table with the set of new rows
			stopLoading();
			if (lastFlight == 0) {
				table.setData(tableCells);
			} else {
				table.appendRow(tableCells);
			}
			
			// Keep track of the last flight index for the next paging operation
			lastFlight += numFlights;
			
			modeButton.enabled = true;
		}
		
		function handleError (error) {
			stopLoading();
			alert(error.message);

			modeButton.enabled = true;
		}		
		
		// Disable the mode selection button so that it can't be changed while we are retrieving data
		modeButton.enabled = false;
		
		// If we are in 'paging' mode then request the next page of records;
		// Otherwise, request the entire set of records
		if (pageMode) {
			DataLayer.getFlightCollectionRows(lastFlight, handleSuccess, handleError);
		} else {
			DataLayer.getFlightCollection(handleSuccess, handleError);
		}
	};
	
	return self;
};

module.exports = MasterView;
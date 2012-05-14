/*
 * Detail View Component Constructor
 */

function DetailView() {
    // Declare required modules
	var Utils = require('utility/utils');
	var Platform = require('utility/platform');
	
	var self = Ti.UI.createView();
	
	var sectionTitles = [
		'Flight Information',
		'Flight Details',
		'Flight Bookings'
	];
	
	var items = [
		{ section: 0, text: 'Flight:', 		label: 'flight' },
		{ section: 0, text: 'From/To:', 	label: 'fromTo' },
		{ section: 0, text: 'Date:', 		label: 'dateTime' },
		{ section: 0, text: 'Fare:', 		label: 'fare' },
		{ section: 1, text: 'Departure:', 	label: 'departureCity' },
		{ section: 1, text: 'Destination:', label: 'destinationCity' },
		{ section: 1, text: 'Flying Time:', label: 'flightTime' },
		{ section: 1, text: 'Distance:', 	label: 'distance' },
		{ section: 1, text: 'Departs:', 	label: 'departureTime' },
		{ section: 1, text: 'Arrives:', 	label: 'arrivalTime' },
		{ section: 2, text: 'Booking', 		clickUri: 'flightBooking' },
		{ section: 2, text: 'Bookings', 	clickUri: 'flightBookings' },
		{ section: 2, text: 'Carrier', 		clickUri: 'carrier' }
	];
	
	function createTable() {
		var sections = [];
		var cnt = items.length;
		var currentSection = -1;
		
		for (var i = 0; i < cnt; i++) {
            // Determine if we need to create a new section in the table.
			if (items[i].section != currentSection) {
				currentSection = items[i].section;
				sections[currentSection] = Ti.UI.createTableViewSection({
					headerTitle: sectionTitles[currentSection]
				});
			}
			
			var row = Ti.UI.createTableViewRow({
				backgroundColor: 'white'
			});

            // If a 'label' is specified then create 2 label controls: the
            // first is the title of the field and the second is the property
            // name used to lookup the field name when binding the data to the control.
            // Otherwise, if a 'clickUri' is specified then create a single label
            // control that displays the title of the field and registers an event
            // listener for when the item is clicked.
			if (items[i].label) {
				row.add(Ti.UI.createLabel({
					text: items[i].text,
					textAlign: 'left',
					font: { fontWeight: 'bold' },
					left: 8, width: 120, height: 40
				}));
				
				self[items[i].label] = Ti.UI.createLabel({
					text: "",
					textAlign: 'right',
					font: { fontWeight: 'normal' },
					right: 8, width: 160, height: 40
				});
				row.add(self[items[i].label]);
				
				sections[currentSection].add(row);
			} else if (items[i].clickUri) {
				row.hasDetail = true;
				row.title = items[i].text;
				var clickUri = items[i].clickUri;
				row.addEventListener('click', function(e) {
					openPropertiesWindow(self[clickUri]);
				});
				
				sections[currentSection].add(row);
			}
		}
	
		var table = Ti.UI.createTableView({
			style: Platform.isiOS ? Ti.UI.iPhone.TableViewStyle.GROUPED : 0,
			data: sections
		});
		
		return table;
	}

    // This is a placeholder method that is called when the user clicks on a 'clickUri'
    // row in the table. You can extend the functionality by invoking an oData request
    // in the DataLayer using the specified 'uri' property name and displaying additional UI.
	function openPropertiesWindow (uri) {
        alert("Clicked on link")
		Ti.API.info("Need to make oData request: " +  uri);
	}

    // Data binding method. This method updates the text of each of the displayed data elements
    // in the UI. Each displayed field was stored in a property of the view when it was created, so
    // we can update the displayed text by simply setting the text property of each field.
	self.refresh = function (flight) {
		self.flight.text = flight.AirLineID + " " + flight.FlightConnectionID;
		self.fromTo.text = flight.FlightDetails.DepartureAirPort + " to " + flight.FlightDetails.DestinationAirPort;
		self.dateTime.text = Utils.formatDate(flight.FlightDate);
		self.fare.text = "$ " + flight.AirFare;
		
		// Details
		self.departureCity.text = flight.FlightDetails.DepartureCity.toUpperCase();
		self.destinationCity.text = flight.FlightDetails.DestinationCity.toUpperCase();
		self.flightTime.text = Utils.formatMinutes(flight.FlightDetails.FlightTime);
		self.distance.text = Math.floor(flight.FlightDetails.Distance) + " " + Utils.formatDistanceUnit(flight.FlightDetails.DistanceUnit);
		self.departureTime.text = flight.FlightDetails.DepartureTime;
		self.arrivalTime.text = flight.FlightDetails.ArrivalTime;
		
		self.flightBooking = flight.FlightBooking.__deferred.uri;
		self.flightBookings = flight.FlightBookings.__deferred.uri;
		self.carrier = flight.FlightBookings.__deferred.uri;
	};	
	
	var table = createTable();
	self.add(table);
	
	self.addEventListener('app:flightSelected', function(e) {
		self.refresh(e.flight);
	});
	
	return self;
};

module.exports = DetailView;

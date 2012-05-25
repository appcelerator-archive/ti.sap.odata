/*
 * Master View Component Constructor
 */

function MasterView(win) {
    // Declare required modules
	var Utils = require('utility/utils');
	var DataLayer = require('data/datalayer');
	var Platform = require('utility/platform');

	var self = Ti.UI.createView({
		backgroundColor:'white'
	});

	var table = Ti.UI.createTableView({});
	var refreshButton = Ti.UI.createButton({
		title: 'Refresh'
	});

    // On iOS platforms we can use the right navigation button to present the refresh button.
    // On other platforms we create a button above the table view.
	if (Platform.isiOS) {
		win.rightNavButton = refreshButton;
	} else {
		refreshButton.top = 5;
		refreshButton.width = 200;
		table.top = 60;
		self.add(refreshButton);
	}
	self.add(table);

    // Set up the event listeners
	// Notify the application when a genre is selected
	table.addEventListener('click', function(e) {
		self.fireEvent('app:genreSelected', {
			genre: e.rowData.genre
		});
	});
		
	refreshButton.addEventListener('click', refresh);

    // Trigger a 'refresh' when the window initially opens
	win.addEventListener('open', refresh);

    // Define the template for each row in the table view
	function TableViewCell (genre) {
		var row = Ti.UI.createTableViewRow({
			hasChild: true,
			className: 'Genre',
            genre: genre
		});
		
		var title = Ti.UI.createLabel({
			text: genre.Name,
            font: { fontSize:18 },
         			top: 6, left: 6, width: 'auto', height: 'auto'
		});

		row.add(title);

		return row;
	}
	
	function refresh () {
		startLoading ();
		populate();
	}
	
    function startLoading () {
		table.setData([Ti.UI.createTableViewRow({title:"Loading..."})]);
    }
    
    function stopLoading () {
    	table.deleteRow(0);
    }	
    
	function populate () {
		function handleSuccess (genreCollection) {
			// Create each of the cells from the collection of genres
			var tableCells = [];
			var numGenres = genreCollection.length;
			for (var i = 0; i < numGenres; i++) {
				tableCells.push(TableViewCell(genreCollection[i]));
			}
			
			// Now update the table with the set of new rows
			stopLoading();
			table.setData(tableCells);
			
			refreshButton.enabled = true;
		}
		
		function handleError (error) {
			stopLoading();
			alert(error.message);

			refreshButton.enabled = true;
		}		
		
		// Disable the mode selection button so that it can't be changed while we are retrieving data
		refreshButton.enabled = false;
		
		// Request the entire set of records
		DataLayer.getGenres(handleSuccess, handleError);
	};
	
	return self;
};

module.exports = MasterView;
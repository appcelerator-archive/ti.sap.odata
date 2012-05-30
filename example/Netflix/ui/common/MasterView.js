/*
 * Master View Component Constructor
 */

function MasterView(win) {
    // Declare required modules
	var Utils = require('utility/utils');
	var DataLayer = require('data/datalayer');
	var Platform = require('utility/platform');

    // Keep track of the index of the last record that has been retrieved so that 'infinite-scrolling'
    // can detect when it needs to request the next page.
	var lastRow = 0;

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

    // Enable infinite-scroll on table
    // Use the 'scrollEnd' event here due to TIMOB-8554. Can switch to 'scroll' event once that
    // issue is resolved.
    table.addEventListener('scrollEnd', handleScroll);

	refreshButton.addEventListener('click', refresh);

    // Trigger a 'refresh' when the window initially opens
	win.addEventListener('open', startup);
	function startup() {
		refresh();
		win.removeEventListener('open', startup);
	}

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
        lastRow = 0;
		populate();
	}

    function handleScroll (evt) {
   		// NOTE: Don't use evt.totalItemCount as these event can be queued up and the item count
   		// may not have been updated yet. So use our internal count.
   	    if ((Platform.isAndroid && (lastRow < evt.firstVisibleItem + evt.visibleItemCount + 3)) ||
   	    	(!Platform.isAndroid && (evt.contentOffset.y + evt.size.height + 100 > evt.contentSize.height))) {
   			populate();
   		}
   	}

    function startLoading () {
		table.setData([Ti.UI.createTableViewRow({title:"Loading..."})]);
    }
    
    function stopLoading () {
    	table.deleteRow(0);
    }	
    
	function populate () {
		function handleSuccess (rowCollection) {
			// Create each of the cells from the collection of genres
			var tableCells = [];
			var numRows = rowCollection.length;
			for (var i = 0; i < numRows; i++) {
				tableCells.push(TableViewCell(rowCollection[i]));
			}
			
			// Now update the table with the set of new rows
			stopLoading();
            if (lastRow == 0) {
			    table.setData(tableCells);
            } else {
                table.appendRow(tableCells);
            }

			// Keep track of the last row index for the next paging operation
			lastRow += numRows;

			refreshButton.enabled = true;
		}
		
		function handleError (error) {
			stopLoading();
			alert(error.message);

			refreshButton.enabled = true;
		}		
		
		// Disable the refresh button so that it can't be changed while we are retrieving data
		refreshButton.enabled = false;
		
		// Request the entire set of records
		DataLayer.getGenresCollectionRows(lastRow, handleSuccess, handleError);
	};
	
	return self;
};

module.exports = MasterView;
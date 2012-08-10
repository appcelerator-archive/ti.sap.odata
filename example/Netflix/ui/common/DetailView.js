/*
 * Detail View Component Constructor
 */

function DetailView() {
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
	self.add(table);

    // Define the template for each row in the table view
	function TableViewCell (detail) {
		var row = Ti.UI.createTableViewRow({
			className: 'Detail',
            detail: detail
		});

        var title = Ti.UI.createLabel({
            text: detail.Name,
            font: { fontWeight: 'bold', fontSize:14 },
            top: 4, left: 4, width: 'auto', height: 'auto'
        });
        var averageRating = Ti.UI.createLabel({
            text: 'Average Rating: ' + detail.AverageRating,
            color: 'gray',
            font: { fontSize: 12 },
            top: 22, left: 4, width: 'auto', height: 'auto'
        });
        var releaseYear = Ti.UI.createLabel({
            text: 'Year Released: ' + detail.ReleaseYear,
            color: 'gray',
            font: { fontSize: 12 },
            top: 38, left: 4, width: 'auto', height: 'auto'
        });
        var rating = Ti.UI.createLabel({
            text: detail.Rating,
            color: 'gray',
            font: { fontSize: 12 },
            top: 4, right: 4, width: 'auto', height: 'auto'
        });

		row.add(title);
        row.add(averageRating);
        row.add(releaseYear);
        row.add(rating);

		return row;
	}

    // Enable infinite-scroll on table
    // Use the 'scrollEnd' event here due to TIMOB-8554. Can switch to 'scroll' event once that
    // issue is resolved.
    table.addEventListener('scrollEnd', handleScroll);

    function refresh (URL) {
        DataLayer.initDetailsCollectionCache(URL);
   		startLoading ();
        lastRow = 0;
   		populate(URL);
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

   	function populate (URL) {
   		function handleSuccess (rowCollection) {
   			// Create each of the cells from the collection of genres
   			var tableCells = [];
			var numRows = 0;
			if (rowCollection) {
				numRows = rowCollection.length;
			} else {
				alert("No data returned. Possibly not enough memory - use paging mode.");
			}
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
   		}

   		function handleError (error) {
   			stopLoading();
   			alert(error.message);
   		}

   		// Request the entire set of records
   		DataLayer.getDetailsCollectionRows(lastRow, handleSuccess, handleError);
   	};

	self.addEventListener('app:genreSelected', function(e) {
		refresh(e.genre.Titles.__deferred.uri);
	});
	
	return self;
};

module.exports = DetailView;

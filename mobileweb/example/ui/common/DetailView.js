/*
 * Detail View Component Constructor
 */

function DetailView() {
    // Declare required modules
	var Utils = require('utility/utils');
    var DataLayer = require('data/datalayer');
	var Platform = require('utility/platform');
	
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

    function refresh (URL) {
   		startLoading ();
   		populate(URL);
   	}

    function startLoading () {
        table.setData([Ti.UI.createTableViewRow({title:"Loading..."})]);
    }

    function stopLoading () {
        table.deleteRow(0);
    }

   	function populate (URL) {
   		function handleSuccess (detailsCollection) {
   			// Create each of the cells from the collection of genres
   			var tableCells = [];
   			var numDetails = detailsCollection.length;
   			for (var i = 0; i < numDetails; i++) {
   				tableCells.push(TableViewCell(detailsCollection[i]));
   			}

   			// Now update the table with the set of new rows
   			stopLoading();
   			table.setData(tableCells);
   		}

   		function handleError (error) {
   			stopLoading();
   			alert(error.message);
   		}

   		// Request the entire set of records
   		DataLayer.getDetails(URL, handleSuccess, handleError);
   	};

	self.addEventListener('app:genreSelected', function(e) {
		refresh(e.genre.Titles.__deferred.uri);
	});
	
	return self;
};

module.exports = DetailView;

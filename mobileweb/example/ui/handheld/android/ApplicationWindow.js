function ApplicationWindow() {
	//declare module dependencies
	var MasterView = require('ui/common/MasterView'),
		DetailView = require('ui/common/DetailView');
		
	//create object instance
	var self = Ti.UI.createWindow({
		title:'Genres',
		exitOnClose:true,
		navBarHidden:false,
		backgroundColor:'#ffffff'
	});
		
	//construct UI
	var masterView = new MasterView(self);
	self.add(masterView);

	//add behavior for master view
	masterView.addEventListener('app:genreSelected', function(e) {
		//create detail view container
		var detailView = new DetailView();
		var detailContainerWindow = Ti.UI.createWindow({
			title:'Titles',
			navBarHidden:false,
			backgroundColor:'#ffffff'
		});
		detailContainerWindow.add(detailView);
		detailView.fireEvent('app:genreSelected',e);
		detailContainerWindow.open();
	});
	
	return self;
};

module.exports = ApplicationWindow;

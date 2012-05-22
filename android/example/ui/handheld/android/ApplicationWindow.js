function ApplicationWindow() {
	//declare module dependencies
	var MasterView = require('ui/common/MasterView'),
		DetailView = require('ui/common/DetailView');
		
	//create object instance
	var self = Ti.UI.createWindow({
		title:'Flights',
		exitOnClose:true,
		navBarHidden:false,
		backgroundColor:'#ffffff'
	});
		
	//construct UI
	var masterView = new MasterView(self);
	self.add(masterView);

	//add behavior for master view
	masterView.addEventListener('app:flightSelected', function(e) {
		//create detail view container
		var detailView = new DetailView();
		var detailContainerWindow = Ti.UI.createWindow({
			title:'Flight Details',
			navBarHidden:false,
			backgroundColor:'#ffffff'
		});
		detailContainerWindow.add(detailView);
		detailView.fireEvent('app:flightSelected',e);
		detailContainerWindow.open();
	});
	
	return self;
};

module.exports = ApplicationWindow;

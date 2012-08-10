function ApplicationWindow() {
	//declare module dependencies
	var MasterView = require('ui/common/MasterView'),
		DetailView = require('ui/common/DetailView');

	//create object instance
	var self = Ti.UI.createWindow({
		backgroundColor:'#ffffff'
	});

	//create master view container
	var masterContainer = Ti.UI.createView({
		top:0,
		bottom:0,
		left:0,
		width:240
	});
    var masterView = new MasterView(self);
    masterView.borderColor = '#000';
    masterView.borderWidth = 1;
	masterContainer.add(masterView);
	self.add(masterContainer);

	//create detail view container
	var detailContainer = Ti.UI.createView({
		top:0,
		bottom:0,
		right:0,
		left:240
	});
    var detailView = new DetailView();
	detailContainer.add(detailView);
	self.add(detailContainer);

	//add behavior for master view
	masterView.addEventListener('app:genreSelected', function(e) {
		detailView.fireEvent('app:genreSelected',e);
	});

	return self;
};

module.exports = ApplicationWindow;
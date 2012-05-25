function ApplicationWindow() {
	//declare module dependencies
	var MasterView = require('ui/common/MasterView'),
		DetailView = require('ui/common/DetailView');
		
	//create master view container
	var masterContainerWindow = Ti.UI.createWindow({
		title: "Genres"
	});
	var masterView = new MasterView(masterContainerWindow);
	masterView.borderColor = '#000';
	masterView.borderWidth = 1;
	masterContainerWindow.add(masterView);
	
	var masterNav = Ti.UI.iPhone.createNavigationGroup({
		window: masterContainerWindow
	});

	//create detail view container
	var detailContainerWindow = Ti.UI.createWindow({
        title: 'Titles'
	});
    var detailView = new DetailView();
	detailContainerWindow.add(detailView);
	
	var detailNav = Ti.UI.iPhone.createNavigationGroup({
		window: detailContainerWindow
	});
	
	var self = Ti.UI.iPad.createSplitWindow({
		masterView: masterNav,
		detailView: detailNav
	});
	
	//add behavior for master view
	masterView.addEventListener('app:genreSelected', function(e) {
		self.setMasterPopupVisible(false);
		detailView.fireEvent('app:genreSelected',e);
	});
	
	self.addEventListener('visible', function(e) {
		if (e.view == 'detail') {
			e.button.title = 'Genres List';
			detailContainerWindow.leftNavButton = e.button;
		} else if (e.view == 'master') {
			detailContainerWindow.leftNavButton = null;
		}
	})

	return self;
};

module.exports = ApplicationWindow;

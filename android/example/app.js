/*
* A master detail view, utilizing a native table view component and platform-specific UI and navigation. 
* A starting point for a navigation-based application with hierarchical data, or a stack of windows. 
* Requires Titanium Mobile SDK 1.8.0+.
* 
* In app.js, we generally take care of a few things:
* - Bootstrap the application with any data we need
* - Check for dependencies like device type, platform version or network connection
* - Require and open our top-level UI component
*  
*/

var Platform = require('utility/platform');

//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');	  	
}

(function() {
	// Determine platform and form factor and render appropriate components
	// iPhone and Mobile Web make use of the platform-specific navigation controller,
	// all other platforms follow a similar UI pattern
	var Window;
    if (Platform.isiPad) {
        Window = require('ui/tablet/ipad/ApplicationWindow');
    } else if (Platform.isTablet) {
		Window = require('ui/tablet/ApplicationWindow');
	} else if (Platform.isiPhone) {
		Window = require('ui/handheld/ios/ApplicationWindow');
	} else if (Platform.isMobileWeb) {
		Window = require('ui/handheld/mobileweb/ApplicationWindow');
	} else {
		Window = require('ui/handheld/android/ApplicationWindow');
	}
	new Window().open();
})();

/*
 * A collection of helper methods and properties for handling platform-specific features
 */

(function(platform) {
	var osname = Ti.Platform.osname,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth,
        name = Ti.Platform.name;

    platform.isAndroid = osname === 'android';
    platform.isiPhone = osname === 'iphone';
    platform.isMobileWeb = osname === 'mobileweb';
    platform.isiPad = osname === 'ipad';
    platform.isiOS = name == 'iPhone OS';

	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
    platform.isTablet = platform.isiPad || (platform.isAndroid && (width > 899 || height > 899));
})(exports);
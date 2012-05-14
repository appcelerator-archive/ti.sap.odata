/*
 * A collection of helper methods and properties
 */
(function(utils) {
	utils.formatDate = function (input) {
		var dtstr = input.replace(/\D/g," ");
		var dtcomps = dtstr.split(" ");
		dtcomps[1]--;
		var convdt = new Date(
            Date.UTC(dtcomps[0],dtcomps[1],dtcomps[2],dtcomps[3],dtcomps[4],dtcomps[5]));
            
        return convdt ? convdt.toLocaleString() : input;
    };
    
    utils.formatMinutes = function (input) {
    	var minutes = parseInt(input, 10);
    	var hours = Math.floor(minutes / 60);
    	minutes = minutes % 60;
    	var fmt = (hours == 0) ? "" : hours + ((hours == 1) ? " hour, " : " hours, ");
    	
    	return fmt + minutes + ((minutes == 1) ? " minute" : " minutes");
    }
    
    utils.formatDistanceUnit = function (input) {
    	if (input === "KMT") {
    		return "kilometers";
    	} else if (input == "SMI") {
    		return "miles";
    	}
    	
    	return input;
    }
})(exports);

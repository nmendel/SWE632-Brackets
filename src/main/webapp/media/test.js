
var test = {
	tournaments: [
		{t_name: "Head Chef", t_format: 'Single Elimination', t_size: 64, t_start: "20141031123456"},
		{t_name: "Big Wigg", t_format: 'Single Elimination', t_size: 8, t_create: "20141021123456", t_start: true, t_end: true},
		{t_name: "Cat Competition", t_format: 'Single Elimination', t_size: 16, t_create: "20141011123456", t_start: true}

	],
	
	teams: [
		{team_name: "Randall Flagg", team_location: "Midworld"},
		{team_name: "Leroy Jenkins", team_location: "Burbank, Australia"},
		{team_name: "Oliver Queen", team_location: "Starling City"}
	],
	
	MockAjax: function() {
	   	Ext.Ajax.request = function(options) {
	   		// options.method, params, url
	   		var url = options.url.split("?")[0];
	   		var data = [];
	   		if(url == '/tournaments') {
	   			console.log("/tournaments");
	   			data = test.tournaments;
	   		} else if(url == '/teams') {
	   			console.log("/teams");
	   			data = test.teams;
	   		} else{
	   			alert("unrecognized mock ajax url: " + url);
	   		}
			
	        var me = this;
	        options.callback({}, true, data);
	        me.fireEvent('requestcomplete');
	   	};
	    init();
	}
};

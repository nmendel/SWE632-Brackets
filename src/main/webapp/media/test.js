
var test = {
	tournaments: [
		Ext.create('TournamentModel', {name: "Head Chef", create_date: "20141031123456"}),
		Ext.create('TournamentModel', {name: "Big Wigg", create_date: "20141021123456", started: true, finished: true}),
		Ext.create('TournamentModel', {name: "Cat Competition",  create_date: "20141011123456", started: true})
	],
	
	teams: [
		Ext.create('TeamModel', {name: "Randall Flagg", location: "Midworld"}),
		Ext.create('TeamModel', {name: "Leroy Jenkins", location: "Burbank, Australia"}),
		Ext.create('TeamModel', {name: "Oliver Queen", location: "Starling City"}),
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
	    bracket.init();
	}
};

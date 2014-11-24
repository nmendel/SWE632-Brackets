
var teams1 = [
		      ["Team 1",  "Team 2" ],
		      ["Team 3",  "Team 4" ],
		      ["Team 5",  "Team 6" ],
		      ["Team 7",  "Team 8" ],
		      ["Team 9",  "Team 10"],
		      ["Team 11", "Team 12"],
		      ["Team 13", "Team 14"],
		      ["Team 15", "Team 16"],
];

var results1 = [[]];
for(var i = 0; i < teams1.length; i++) {
	results1[0].push(['', '', 'Match ' + (i + 1)]);
}

var test = {
	tournaments: [
		{t_name: "Head Chef", t_format: 'Single Elimination', t_size: 64, t_start: "20141031123456", teams: teams1, results: results1},
		{t_name: "Big Wigg", t_format: 'Single Elimination', t_size: 8, t_create: "20141021123456", t_start: true, t_end: true},
		{t_name: "Cat Competition", t_format: 'Single Elimination', t_size: 16, t_create: "20141011123456", t_start: true}

	],
	
	teams: [
		{team_name: "Randall Flagg", team_location: "Midworld", team_active: '1'},
		{team_name: "Leroy Jenkins", team_location: "Burbank, Australia", team_active: '1'},
		{team_name: "Oliver Queen", team_location: "Starling City", team_active: '1'},
		{team_name: "Really fucking long name, way too long", team_location: "Starling City", team_active: '1'}
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


var bracket = {
	teams: [],
	results: [],
	
	onMatchClick: function(data) {
		console.log(data);
	},
	
	editMatch: function(container, data, doneCb) {
		var input = $('<input type="text">');
	    input.val(data.name);
	    container.html(input);
	    input.focus();
	    input.blur(function() { doneCb({flag: data.flag, name: input.val()}) });
	},
	
	create: function() {
		// TODO: can make them look like this and use all of the data for rendering and other stuff
		/*    teams : [
      		[{name: "Team 1", flag: 'fi'}, {name: "Team 2", flag: 'kr'}],
      		[{name: "Team 3", flag: 'se'}, {name: "Team 4", flag: 'us'}]
    	]*/
    	
		bracket.teams = [
		      ["Team 1",  "Team 2" ],
		      ["Team 3",  "Team 4" ],
		      ["Team 5",  "Team 6" ],
		      ["Team 7",  "Team 8" ],
		      ["Team 9",  "Team 10"],
		      ["Team 11", "Team 12"],
		      ["Team 13", "Team 14"],
		      ["Team 15", "Team 16"],
		      ["Team 1ff",  "Team 2f" ],
		      ["Team 3f",  "Team 4f" ],
		      ["Team 5f",  "Team 6f" ],
		      ["Team 7f",  "Team 8f" ],
		      ["Team 9f",  "Team 1f0"],
		      ["Team 1f1", "Team 1f2"],
		      ["Team 1f3", "Team 1f4"],
		      ["Team 1f5", "Team 1f6"],
		      ["Team 1d",  "Team 2d" ],
		      ["Team 3d",  "Team 4fd" ],
		      ["Team 5d",  "Team 6fd" ],
		      ["Team 7d",  "Team 8fd" ],
		      ["Team 9d",  "Team 1fd0"],
		      ["Team 1d1", "Team 12d"],
		      ["Team 1d3", "Team 14d"],
		      ["Team 1d5", "Team 16d"],
		      ["Team 1e",  "Team 2de" ],
		      ["Team 3e",  "Team 4de" ],
		      ["Team 5e",  "Team 6de" ],
		      ["Team 7e",  "Team 8de" ],
		      ["Team 9e",  "Team 1de0"],
		      ["Team 1e1", "Team 12e"],
		      ["Team 1e3", "Team 14e"],
		      ["Team 1e5", "Team 16e"],
		];
		
		bracket.results = [[]];
		for(var i = 0; i < bracket.teams.length; i++) {
			bracket.results[0].push(['', '', 'Match ' + (i + 1)]);
		}

		var minimalData = {
		    teams: bracket.teams,
		    results : bracket.results
		};
		 
	    $('#bracket .bracket').bracket({
	    	 skipConsolationRound: true,
		     init: minimalData, /* data to initialize the bracket with */
		     save: function(){}, /* without save() labels are disabled */
    		 decorator: {edit: bracket.editMatch,
    		 			 render: render_fn}
		});
	}	
};

/* Edit function is called when team label is clicked */
function edit_fn(container, data, doneCb) {
  var input = $('<input type="text">');
  input.val(data.name);
  container.html(input);
  input.focus();
  input.blur(function() { doneCb({flag: data.flag, name: input.val()}) });
}
 
/* Render function is called for each team label when data is changed, data
 * contains the data object given in init and belonging to this slot. */
function render_fn(container, data, score) {
  /*
  if (!data.flag || !data.name)
    return
  container.append('<img src="site/png/'+data.flag+'.png" /> ').append(data.name)
  */
 return container.append(data);
}

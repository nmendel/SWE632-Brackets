// TODO: disable or use buttons from jquery UI that can change the size and format of the tournament?

// TODO: remove these once we can get them from the db
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
var teams2 = [
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
		
var bracket = {
	editing: false,
	tournamentModel: null,
	
	gameEditing: {
		container: null,
		doneCallback1: null,
		doneCallback2: null
	},
	
	onMatchClick: function(data) {
		console.log(data);
	},
	
	gameFromTeamLabel: function(teamLabel) {
		return $(teamLabel).parents("div.teamContainer");
	},
	
	teamsFromGameContainer: function(gameContainer) {
		return gameContainer.children("div.team").children("div.label");
	},
	
	/*
	 * Triggered if you click on a team name
	 */
	editMatch: function(container, data, doneCb) {
		// short circuit
		if(bracket.editing) {
			bracket.editing = false;
			doneCb(data);
			return;
		}
		
		// TODO: handle switching, is it necessary?
		if(bracket.gameEditing.container != null) {
			//console.log("b " + bracket.gameEditing.container);
			/*
			var teamName = bracket.gameEditing.container[0].innerHTML;
			bracket.gameEditing.container = null;
			bracket.gameEditing.doneCallback(teamName);
			
			// wait for that doneCallback to finish, call this function again (race condition)
			return setTimeout(function() {bracket.editMatch(container, data, doneCb)}, 1000);
			*/
		}
		
		//bracket.gameEditing.container = container;
		var gameContainer = bracket.gameFromTeamLabel(container);
		var teamContainers = bracket.teamsFromGameContainer(gameContainer);
		var team1 = teamContainers[0].innerHTML;
		var team2 = teamContainers[1].innerHTML;
		
		// Figure out which container was clicked on
		var index = 1;
		if(team1 == data) {
			index = 0;
		}
		
		doneCb(data);
		
	    // Show team options 
	    team.panel.object.expand();
	    team.picker.pickTeams(gameContainer, teamContainers, team1, team2, index);
	    
	    // Add picking class to both teams
		gameContainer.children("div.team").addClass("picking");
	},
	
	doneEditing: function(gameContainer, team1, team2) {
		// Remove picking class to both teams
		console.log("done editing");
		console.log(gameContainer);
		gameContainer.children("div.team").removeClass("picking");
		var teamContainers = bracket.teamsFromGameContainer(gameContainer);
		
		// replace in bracket.tournamentModel.data
		bracket.replaceTeam(teamContainers[0].innerHTML, team1);
		bracket.replaceTeam(teamContainers[1].innerHTML, team2);
		
		// save in db
		var bracketObj = {
			teams: bracket.tournamentModel.data.teams,
			results: bracket.tournamentModel.data.results
		};
		bracket.save(bracketObj, null, true);
		bracket.editing = true;
	},
	
	replaceTeam: function(team, newTeam) {
		for(var i = 0; i < bracket.tournamentModel.data.teams.length; i++) {
			if(bracket.tournamentModel.data.teams[i][0] === team) {
				bracket.tournamentModel.data.teams[i][0] = newTeam;
			} else if(bracket.tournamentModel.data.teams[i][1] === team) {
				bracket.tournamentModel.data.teams[i][1] = newTeam;
			}
		}
	},
	
	/*
	 * Render is called on every match everytime something is edited (even if it didn't change)
	 */
	renderMatch: function(container, data, score) {
	    return container.append(data);
	},
	
	/*
	 * Triggered onBlur for a team name or score
	 */
	save: function(bracketObj, arg2, doAjax) {
		console.log("save");
		console.log(bracketObj);
		console.log(doAjax);

		bracket.tournamentModel.data.teams = bracketObj.teams;
		bracket.tournamentModel.data.results = bracketObj.results;
		console.log(bracket.tournamentModel.data);
		
		if(doAjax) {
			// TODO: we need to make our server calls properly cause the success function to fire
			postData('tournaments', bracket.tournamentModel.data, function() {
				console.log("success");
				// TODO: reload? tournament.store.object.reload();
			}, function() {
				console.log("error");
			}, 'PUT');	
		}
	},
	
	create: function() {
		// TODO: create new bracket
	},
	
	show: function(tournamentRow, index) {
		/*
		// this was mock data, so should be removed once we can get this info from the db
		if(index == 1) {
			tournamentRow.data['teams'] = teams1;			
		} else if(index == 2) {
			tournamentRow.data['teams'] = teams2;
		}
		
		if(!tournamentRow.data['results']) {
			tournamentRow.data['results'] = [[]];
			for(var i = 0; i < bracket.tournamentModel.data.teams.length; i++) {
				tournamentRow.data.results[0].push(['', '', 'Match ' + (i + 1)]);
			}
			console.log("fake results");
		}
		*/
		
		bracket.tournamentModel = tournamentRow;

		var data = {
		    teams: [[]],
		    results : [[]]
		};
		 
		if(bracket.tournamentModel.data.results && bracket.tournamentModel.data.teams) {
			data.results = bracket.tournamentModel.data.results;
			data.teams = bracket.tournamentModel.data.teams;
		}
		 
	    $('#bracket .bracket').bracket({
	    	 skipConsolationRound: true,
		     init: data, /* data to initialize the bracket with */
		     save: bracket.save, /* without save() labels are disabled */
    		 decorator: {edit: bracket.editMatch,
    		 			 render: bracket.renderMatch}
		});
	}
};

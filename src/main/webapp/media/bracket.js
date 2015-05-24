// TODO: disable or use buttons from jquery UI that can change the size and format of the tournament?

var bracket = {
	editing: false,
	editingIndex: 0,
	saving: false,
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
				bracket.editingIndex = i * 2;
				break;
			} else if(bracket.tournamentModel.data.teams[i][1] === team) {
				bracket.tournamentModel.data.teams[i][1] = newTeam;
				bracket.editingIndex = (i * 2) + 1;
				break;
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
		
		var json = {
			t_name: bracket.tournamentModel.data.t_name,
			teams: JSON.stringify(bracket.tournamentModel.data.teams),
			results: JSON.stringify(bracket.tournamentModel.data.results)
		};
		
		if(doAjax) {
			bracket.saving = true;
			postData('tournaments', json, function() {
				console.log("success");
				tournament.store.object.reload();
				// simulate click - this seems sort of crazy
				$('div.team:not(.picking)').children('div.label.editable')[bracket.editingIndex + 1 % 3].click();
			}, function() {
				console.log("error");
			}, 'PUT');	
		} else if(!bracket.saving) {
			// Do it anyway, but don't reload stuff
			postData('tournaments', json, function() {
				console.log("success");
			}, function() {
				console.log("error");
			}, 'PUT');	
		} else {
			bracket.saving = false;
		}
	},
	
	create: function() {
		// TODO: create new bracket
	},
	
	show: function(tournamentRow, index) {
		console.log(tournamentRow.data); // tournamentRow.data.teams and '...'.results are null here
		
		bracket.tournamentModel = tournamentRow;

		var data = {
		    teams : [[]],
		    results : [[]]
		};
		 
		if(bracket.tournamentModel.data.results && bracket.tournamentModel.data.teams) {
			data.results = bracket.tournamentModel.data.results;
			data.teams = bracket.tournamentModel.data.teams;
		}
		
		console.log(data);
		 
	    $('#bracket .bracket').bracket({
	    	 skipConsolationRound: true,
		     init: data, /* data to initialize the bracket with */
		     save: bracket.save, /* without save() labels are disabled */
    		 decorator: {edit: bracket.editMatch,
    		 			 render: bracket.renderMatch}
		});
		
		// Hide those jquery bracket buttons
		$('span.increment').hide();
		$('span.decrement').hide();
		$('span.doubleelimination').hide();
		$('span.singleelimination').hide();
	}
};

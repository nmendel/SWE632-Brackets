Ext.onReady(function(){
	var data = [{id: 1, team_name: 'Hydras', elo:1300},
			{id: 2, team_name: 'Burglars', elo:1100},
			{id: 3, team_name: 'Tornados', elo:1600}];
	get(window.location.origin + '/teams.jsp', function(resp) {
		var teams = $.parseHTML(resp);
		console.log(teams);
		var t = [];
		for(var i; i < teams.length; i++) {
			t.push(teams[i].innerHTML);
		}
		console.log(t);
		
		Ext.define('TeamModel',{
			extend: 'Ext.data.Model',
			fields: [ 
				{name: 'id'},
				{name: 'team_name'},
				{name: 'elo'},
			]
		});
					
		var store = Ext.create('Ext.data.Store', {
			model: 'TeamModel',
			autoLoad: true,
			data: data
		});
				
		var grid = Ext.create('Ext.grid.Panel', {
			store: store,
			columns: [
				{text: "Team Name", width: 120, dataIndex: 'team_name', sortable: true},
				{text: "ELO", flex: 1, dataIndex: 'elo', sortable: true},
			],
			forceFit: true,
			height:210,
			split: true,
			region: 'north'
		});
		
		var form = Ext.create('Ext.panel.Panel', {
			bodyStyle: {background: 'transparent'},
			items: [{
				xtype: 'form',
				bodyStyle: {background: 'transparent'},
				border: false,
				fieldDefaults: {
					labelWidth: 125,
					autoFitErrors: false
				},
				defaults: {
					width: 265
				},
				items: [{
					fieldLabel: 'New Team',
					xtype: 'textfield',
					margin: "10 10 10 10",
				},{
					xtype: 'button',
					margin: "30 0 0 130",
					scale: 'medium',
					disabled: false,
					width: 125,
					text : "Create",
					listeners: {
						click: function() {
							addTeam('test', 1200);
						}
					}
				}]
			}]
		});
			
		Ext.create('Ext.Panel', {
			renderTo: 'main-container',
			frame: true,
			title: 'Team List',
			width: 580,
			height: 400,
			layout: 'border',
			items: [grid, form]
		});
	});
});

function addTeam(name, elo) {
    var data = {
	    team_name: name,
		elo: elo
	};
	postData(window.location.origin + '/create', data, function() {
	  console.log('now reload the grid');
	});
}

function postData(url, data, successFunc, errorFunc, alternateType) {
	var type = "POST";
	if(alternateType) {
		type = alternateType;
	}
	$.ajax({
		type : type,
		url : url,
		data : JSON.stringify(data),
		contentType : "application/json",
		accepts : "application/json",
		dataType : "json",
		success : successFunc,
		error : errorFunc,
	});
	return false;
}
function get(url, success, error, complete) {
	$.ajax({
		type : "GET",
		url : url,
		success: success,
		error: error,
		complete: complete
	});
}
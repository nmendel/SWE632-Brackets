(function() {
    var cfg = Ext.Loader.getConfig();
    cfg.enabled = true;
    Ext.Loader.setConfig(cfg);
    Ext.Loader.setPath('MyApp', 'media/js');
    Ext.require([
	    'Ext.grid.*',
	    'Ext.data.*',
	    'Ext.panel.*',
	    'Ext.layout.container.Border'
	]);
    Ext.onReady(function() {
        Ext.create('MyApp.views.MainContainer');
        teams.init();
    });
})();



Ext.define('TeamModel',{
	extend: 'Ext.data.Model',
	fields: [ 
		{name: 'team_name', convert: function(value, record) {
			return record.raw;
		}},
	]
});


Ext.define('MyApp.views.MainContainer', {
	extend: 'Ext.Panel',
    renderTo: 'main-container',
    id: 'main-container',
	frame: true,
	title: 'Team List',
	width: 580,
	height: 400,
	margin: '20 20 20 20',
	layout: 'border',
	items: []
});

var teams = {
	init: function() {
		
		get(window.location.origin + '/teams.jsp', function(resp) {
			var data = getTeams(resp);
			store.loadData(data);
		});
					
		var store = Ext.create('Ext.data.ArrayStore', {
		    id: 'team_store',
			model: 'TeamModel',
			//autoLoad: true,
			//data: data,
			expandData: true
		});
				
		var grid = Ext.create('Ext.grid.Panel', {
			id: 'team_grid',
			store: store,
			columns: [
				{text: "Team Name", width: 120, dataIndex: 'team_name', sortable: true},
				//{text: "ELO", flex: 1, dataIndex: 'elo', sortable: true},
			],
			forceFit: true,
			height:210,
			margin: '10 10 10 10',
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
					id: 'team_name',
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
						    var nameField = Ext.getCmp('team_name');
							addTeam(nameField.value, 1200);
							nameField.setValue('');
							// TODO: reload the grid
						}
					}
				}]
			}]
		});
		
		var container = Ext.getCmp('main-container');
		container.add(grid);
		container.add(form);
	}
};

function reloadGrid() {
    get(window.location.origin + '/teams.jsp', function(resp) {
		var data = getTeams(resp);
		var store = Ext.getCmp('team_grid').getStore();
		store.setData(data);
		//store.reload();
	});
}

function getTeams(resp) {
	var teams = $.parseHTML(resp);
	var data = [];
	for(var i = 0; i < teams.length; i++) {
		var team = teams[i];
		if($(team).is('div'))  {
			data.push(team.innerHTML);
		}
	}
	return data;
}

function addTeam(name, elo) {
    var url = window.location.origin + '/create?';
	url = url + 'tournamentName=default&content=' + name;
	postData(url, {}, function() {
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
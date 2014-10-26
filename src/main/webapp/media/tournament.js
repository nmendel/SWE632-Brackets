
Ext.define('TournamentModel',{
	extend: 'Ext.data.Model',
	fields: [ 
		{name: 'name'},
	]
});

var testdata = [['abc'], ['def']];
var tournament = {
	createAccordionPanel: function() {
		// TODO: need grid and stuff
		var container = Ext.create('Ext.panel.Panel', {
			id: 'tournament-panel',
            title:'Tournaments',
            autoScroll: true,
            border: false,
            iconCls: 'nav',
            items: []
		});
		
		var store = Ext.create('Ext.data.ArrayStore', {
		    itemId: 'tournament_store',
			model: 'TournamentModel',
			//autoLoad: true,
			data: testdata,
			expandData: true
		});
				
		var grid = Ext.create('Ext.grid.Panel', {
			itemId: 'tournament_grid',
			store: store,
			columns: [
				{text: "Tournament Name", width: 120, dataIndex: 'name', sortable: true},
				//{text: "ELO", flex: 1, dataIndex: 'elo', sortable: true},
			],
			forceFit: true,
			height:210,
			margin: '10 10 10 10',
			split: true
		});
		
		container.add(grid);
		return container;
	},
	
	create: function() {
		console.log("new tournament");	
	},
};


Ext.define('TournamentModel',{
	extend: 'Ext.data.Model',
	fields: [ 
		{name: 'name'},
		{name: 'create_date'},
		{name: 'started', type: 'bool'},
		{name: 'finished', type: 'bool'}
	]
});

var tournament = {
	panel: null,
	store: null,
	grid: null,
	
	createAccordionPanel: function() {
		tournament.panel = Ext.create('Ext.panel.Panel', {
			id: 'tournament-panel',
            title:'Tournaments',
            autoScroll: true,
            border: false,
            iconCls: 'nav',
            items: []
		});
		
		tournament.store = Ext.create('Ext.data.Store', {
		    itemId: 'tournament_store',
			model: 'TournamentModel',
			autoLoad: true,
			autoSync: true,
			expandData: true,
			proxy: {
	            type: 'ajax',
	            url : '/tournaments',
                headers: {
                    Accept: 'application/json'
                },
	            reader: {
	                type: 'json',
	                root: 'responseText'
	            }
	        }
		});
				
		tournament.grid = Ext.create('Ext.grid.Panel', {
			itemId: 'tournament_grid',
			store: tournament.store,
			columns: [
				{text: "Tournament Name", width: 120, dataIndex: 'name', sortable: true},
				{text: "Date Created", flex: 1, dataIndex: 'create_date', sortable: true},
				{text: "Started", flex: 2, dataIndex: 'started', sortable: true},
				{text: "Finished", flex: 3, dataIndex: 'finished', sortable: true},
			],
			forceFit: true,
			height:210,
			//margin: '10 10 10 10',
			split: true
		});
		
		tournament.panel.add(tournament.grid);
		return tournament.panel;
	},
	
	create: function() {
		console.log("new tournament");	
	},
};

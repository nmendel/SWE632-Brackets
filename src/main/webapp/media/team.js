
Ext.define('TeamModel',{
	extend: 'Ext.data.Model',
	fields: [ 
		{name: 'name'},
	]
});

var team = {
	panel: {
		object: null,
		
		create: function() {
			team.panel.object = Ext.create('Ext.panel.Panel', {
				id: 'team-panel',
	            title:'Teams',
	            autoScroll: true,
	            border: false,
	            iconCls: 'nav',
	            items: []
			});
			
			var store = team.store.create();
			team.grid.create(store);
			team.panel.object.add(team.grid.object);
			return team.panel.object;
		}
	}, 
	
	store: {
		object: null,
		
		create: function() {
			team.store.object = Ext.create('Ext.data.Store', {
			    itemId: 'team_store',
				model: 'TeamModel',
				autoLoad: true,
				autoSync: true,
				expandData: true,
				proxy: {
		            type: 'ajax',
		            url : '/teams',
	                headers: {
	                    Accept: 'application/json'
	                },
		            reader: {
		                type: 'json',
		                root: 'responseText'
		            }
		        }
			});
			return team.store.object;
		}
	},
	
	grid: {
		object: null,
		
		create: function(store) {
			team.grid.object = Ext.create('Ext.grid.Panel', {
				itemId: 'team_grid',
				store: store,
				columns: [{
					text: "Team Name",
					width: 140,
					dataIndex: 'name',
					sortable: true
				},{
	                text : 'team_id',
	                dataIndex : 'id',
	                hidden : true
	            }],
				forceFit: true,
				//height:210,
				split: true,
	            viewConfig : {
	                stripeRows : true
	            },
				listeners : {
	                select : team.grid.onSelect,
	                // itemcontextmenu : 
	                // itemdblclick :
	                // afterrender : 
	            },
			});
			return team.grid.object;
		},
		
		onSelect: function() {
			console.log("select");
		}
	}
};

// TODO: make updating a row save to the db

Ext.define('TeamModel',{
	extend: 'Ext.data.Model',
	fields: [ 
		{name: 'name'},
		{name: 'location'}
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
		rowEditing: null,
		
		create: function(store) {
		    team.grid.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
    		    clicksToMoveEditor: 1,
        		autoCancel: false
    		});
    		
			team.grid.object = Ext.create('Ext.grid.Panel', {
				itemId: 'team_grid',
				store: store,
				columns: [{
					text: "Team Name",
					width: 140,
					dataIndex: 'name',
					sortable: true,
		            editor: {
		                allowBlank: false
        		    }
				},{
					text: "Location",
					width: 140,
					dataIndex: 'location',
					sortable: true,
		            editor: {
		                allowBlank: true
        		    }
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
	            plugins: [team.grid.rowEditing],
                tbar: [{
		            text: 'Add Team',
		            iconCls: 'team-add',
		            handler : team.grid.addTeam,
		        },{
		            itemId: 'removeTeam',
		            text: 'Remove Team',
		            iconCls: 'team-remove',
		            handler: team.grid.removeTeam,
		            disabled: true
		        }],
				listeners : {
		            selectionchange: function(view, records) {
                		team.grid.object.down('#removeTeam').setDisabled(!records.length);
            		},
	                // select :
	                // itemcontextmenu : 
	                // itemdblclick :
	                // afterrender : 
	            },
			});
			return team.grid.object;
		},
		
		addTeam: function() {
			var store = team.grid.object.getStore();
            team.grid.rowEditing.cancelEdit();

            // Create a model instance
            var r = Ext.create('TeamModel', {
                name: 'New Guy',
                location: 'Downtown'
            });

			// TODO: needs to be implemented, make ajax call and update store/grid
            store.insert(0, r);
            test.teams.push(r);
            console.log(test.teams[0].data);
            // \TODO
            
            team.grid.rowEditing.startEdit(0, 0);
       },
       
        removeTeam: function() {
        	var store = team.grid.object.getStore();
            var sm = team.grid.object.getSelectionModel();
            team.grid.rowEditing.cancelEdit();
            
            // TODO: needs to be implemented, make ajax call and update store/grid
            store.remove(sm.getSelection());
            // \TODO
            
            if (store.getCount() > 0) {
                sm.select(0);
            }
        }
	}
};

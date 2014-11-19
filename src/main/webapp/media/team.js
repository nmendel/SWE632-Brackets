// TODO: make updating a row save to the db

Ext.define('TeamModel',{
	extend: 'Ext.data.Model',
	fields: [
		{name: 'team_id'}, 
		{name: 'team_name'},
		{name: 'team_location'},
		{name: 'team_active'}
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
		            },
		            listeners: {
		            	add: function() {console.log("add");},
		            	load: function() {console.log("load");},
		            	update: function() {console.log("update");},
		            	write: function() {console.log("write");}
		            }
		       },
   		       filters: [
  			  		function(item) {
  			  			var name = item.get('team_name');
  			  			var active = item.get('team_active');
        				return name !== '' && name !== 'null' && active == '1';
    				}
				]
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
        		autoCancel: false,
        		listeners: {
        			canceledit: function(rowEd, row) {
        				if(row.record.data.team_name == "") {
        					row.store.remove(row.rowIdx);
        					row.store.reload();
        				}
        			},
        			edit: function(rowEd, row) {
        				console.log("edit");
        			},
        			beforeedit: function(rowEd, row) {
        				console.log("beforeedit");
        			}
        		}
    		});
    		
			team.grid.object = Ext.create('Ext.grid.Panel', {
				itemId: 'team_grid',
				store: store,
				columns: [{
					text: "Team Name",
					width: 140,
					dataIndex: 'team_name',
					sortable: true,
		            editor: {
		                allowBlank: true
        		    }
				},{
					text: "Location",
					width: 140,
					dataIndex: 'team_location',
					sortable: true,
		            editor: {
		                allowBlank: true
        		    }
				},{
	                text : 'team_id',
	                dataIndex: 'team_id',
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

            postData('teams', {team_name: ''}, function(resp) {
            	console.log(resp);
            	store.remove(0); // TODO: 2 rows are being added?
            	store.insert(0, Ext.create('TeamModel', resp));
            	team.grid.rowEditing.startEdit(0, 0);
            });
            
            
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

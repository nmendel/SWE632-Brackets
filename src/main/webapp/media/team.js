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
	MAX_NAME_LENGTH: 18,
	
	panel: {
		object: null,
		teamPicker: null,
		
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
			
			team.panel.object.add(team.picker.create());
			team.panel.object.add(team.grid.object);
			return team.panel.object;
		}
	},
	
	picker: {
		object: null,
		pickingContainer: null,
		
		create: function() {
			team.picker.object = Ext.create("Ext.panel.Panel", {
				id: 'picker-panel',
            	hidden: true,
            	resizeable: true,
            	layout: {
            		type: 'fit',
            	},
            	items: [{
            		xtype: 'panel',
            		defaults: {
	                	enableToggle: true
	                },
	            	items: [{
	            		xtype: 'box',
	            		html: '<div style="text-align: center; color: #666;"><p><h1>Set teams:</h1></p></div>'
	            	},{
	            		xtype: 'panel',
	            		layout: {
	        			    type: 'hbox',
						    pack: 'center',
						    align: 'center'
	            		},
	            		border: false,
	            		items: [{
		                    xtype: 'button',
		                    text: '',
		                    scale: 'large',
		                    margin: '0 20 30 20',
		                    toggleGroup: 'picker',
		                    listeners: {
		                    	// Don't allow this button to be unpressed by pressing it
		                    	// toggle by pressing the other button only
		                    	click: function() {
		                    		if(!this.pressed) {
		                    			this.toggle(true, true);
		                    		}
		                    	}
		                    }
		                },{
		                    xtype: 'button',
		                    text: '',
		                    scale: 'large',
		                    margin: '0 10 30 10',
		                    toggleGroup: 'picker',
		                    listeners: {
		                    	// Don't allow this button to be unpressed by pressing it
		                    	// toggle by pressing the other button only
		                    	click: function() {
		                    		if(!this.pressed) {
		                    			this.toggle(true, true);
		                    		}
		                    	}
		                    }
		                },{
		                	xtype: 'button',
		                	iconCls: 'ok',
		                	scale: 'small',
		                	listeners: {
		                		click: team.picker.done
		                	}
		                }]
	            	}]
            	}]
            });
            
	        return team.picker.object;
		},
		
		pickTeams: function(gameContainer, teamContainers, team1, team2, index) {
		    console.log("Pick teams: " + team1 + " vs " + team2);
			team.picker.object.show();
			
			team.picker.pickingContainer = gameContainer;
			
			// set the team names and toggle the button for the team that was clicked on
			var teamButtons = team.picker.object.query("button");
			teamButtons[0].setText(team1.substr(0, team.MAX_NAME_LENGTH));
			teamButtons[1].setText(team2.substr(0, team.MAX_NAME_LENGTH));
			teamButtons[index].toggle(true, true);
			teamButtons[(index + 1) % 2].toggle(false, true);
		},
		
		done: function() {
			team.picker.object.hide();
			var buttons = team.picker.object.query("button");
			bracket.doneEditing(team.picker.pickingContainer, buttons[0].text, buttons[1].text);
		},
		
		setTeam: function(grid, row, index) {
			if(team.picker.object.isVisible()) {
				var teamButtons = team.picker.object.query("button");
				var index = 0;
				if(teamButtons[1].pressed) {
					index = 1;
				}
				
				teamButtons[index].setText(row.data.team_name.substr(0, team.MAX_NAME_LENGTH));
			}
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
					name:'team_name',
					sortable: true,
		            editor: {
		                allowBlank: true
        		    }
				},{
					text: "Location",
					width: 140,
					dataIndex: 'team_location',
					name:'team_location',
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
	                select: team.picker.setTeam
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
            	store.remove(0);
            	store.insert(0, Ext.create('TeamModel', resp));
            	team.grid.rowEditing.startEdit(0, 0);
            	
            	// set focus on the top row, one way or another
            	try {
            		$(team.grid.object.el.dom).children("div[id^=roweditor-]")
            			.children("div[id^=roweditor-]").children("div[id^=roweditor-]")
            			.children("div[id^=roweditor-]").children("table").children("tbody")
            			.children("tr").children("td").children("input")[0].focus();	
            	} catch(e) {
            		// do nothing
            	}

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

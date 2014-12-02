
function teamsToJSON(v, record) {
	if(typeof record.data.teams == "string") {
	    console.log("teamsToJSON");
	    console.log(record.data.teams);
		return $.parseJSON(record.data.teams);
	} else {
		return record.data.teams;	
	}
}

function resultsToJSON(v, record) {
	if(typeof record.data.results == "string") {
		console.log("resultsToJSON");
        console.log(record.data.results);
        return $.parseJSON(record.data.results);
	} else {
		return record.data.results;	
	}
}

Ext.define('TournamentModel',{
	extend: 'Ext.data.Model',
	fields: [ 
		{name: 't_name'},
		{name: 't_size'},
		{name: 't_format'},
		{name: 't_create'},
		{name: 't_start', type: 'bool'},
		{name: 't_end', type: 'bool'},
		{name: 'teams'},
		{name: 'results'}
	]
});

var tournament = {
	teams:[[]],
	results:[[]],
	
	form: {
		object: null,
		
		create: function() {
			tournament.form.object = new Ext.form.Panel({
		        width:400,
		        height:320,
		        title:'',
		        floating:true,
		        closable:true,
		        hidden:false,
		        items:[
                    new Ext.create('Ext.panel.Panel', {
                        width:400,
                        padding:10,
                        border:false,
                        xtype: 'panel',
                        layout: {
                            type: 'hbox',
                            pack: 'center',
                            align: 'center'
                        },
                        items:[{
                            xtype:'label',
                            text:'New Tournament',
                            align:'middle',
                            style: 'font-size:20px'
                        }]
		            }),
		            {
		                id:'tournament_name',
		                xtype:'textfield',
		                fieldLabel:'Name',
		                name:'name',
		                padding:10
		            },
		            new Ext.form.RadioGroup({
		               id:'tournament_format',
		               xtype:'radiogroup',
		               fieldLabel:'Format',
		               columns:1,
		               padding:10,
		               vertical:true,
		               items: [
		                   { boxLabel: 'Single Elimination', name: 'tf', inputValue: 'single', checked:true },
		                   { boxLabel: 'Double Elimination', name: 'tf', inputValue: 'double'}
		               ]
		            }),
		            new Ext.form.RadioGroup({
		               id:'num_of_teams',
		               xtype:'radiogroup',
		               fieldLabel:'Team Count',
		               columns:2,
		               padding:10,
		               vertical:true,
		               items: [
		                    { boxLabel: '8' , name: 'nt', inputValue: '8', checked:true },
		                    { boxLabel: '16', name: 'nt', inputValue: '16'},
		                    { boxLabel: '32', name: 'nt', inputValue: '32'},
		                    { boxLabel: '64', name: 'nt', inputValue: '64'}
		               ]
		            }),
		            new Ext.create('Ext.panel.Panel', {
		                width:400,
		                padding:10,
		                border:false,
                        xtype: 'panel',
                        layout: {
                            type: 'hbox',
                            pack: 'center',
                            align: 'center'
                        },
                        items:[
                            {
                                xtype:'button',
                                text:'Create',
                                margin:'10 10 10 10',
                                listeners: {
                                    click:tournament.form.save
                                }
                            },
                            {
                                xtype:'button',
                                text:'Cancel',
                                margin:'10 10 10 10',
                                listeners: {
                                    click: function() {
                                        if(tournament.form.object != null) {
                                            tournament.form.object.close();
                                        }
                                    }
                                }
                            }
                        ]
		            })
		        ]
		    });


		    
		    tournament.form.object.show();
		    Ext.getCmp('tournament_name').focus('', 10);

		    return tournament.form.object;
    	},
    	
    	save: function() {
            var name = Ext.getCmp('tournament_name').getValue();
            var format = Ext.getCmp('tournament_format').getValue().tf;
            var num = Ext.getCmp('num_of_teams').getValue().nt;

    		postData('tournaments',
    		    {
    		        t_name:name,
    		        t_format:format,
    		        t_size:num,
    		        teams:"[[]]",
                    results:"[[]]"
                },
                function(resp) {
                    tournament.form.reload();
                    tournament.grid.object.getSelectionModel().select(0); // TODO: change to select the row of new tournament
                }
    		);
    		tournament.form.object.close();
    	},

        reload: function() {
            tournament.store.object.reload();
        },
	},
	
	panel: {
		object: null,
		
		create: function() {
			tournament.panel.object = Ext.create('Ext.panel.Panel', {
				id: 'tournament-panel',
	            title:'Tournaments',
	            autoScroll: true,
	            border: false,
	            iconCls: 'nav',
	            items: []
			});
			
			var store = tournament.store.create();
			tournament.grid.create(store);
			tournament.panel.object.add(tournament.grid.object);
			return tournament.panel.object;
		}
	}, 
	
	store: {
		object: null,
		
		create: function() {
			tournament.store.object = Ext.create('Ext.data.Store', {
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
		            }
		        }
			});

			return tournament.store.object;
		}
	},
	
	grid: {
		object: null,
		
		create: function(store) {
			tournament.grid.object = Ext.create('Ext.grid.Panel', {
				itemId: 'tournament_grid',
				store: store,
				columns: [{
					text: "Tournament Name",
					width: 140,
					dataIndex: 't_name',
					sortable: true
				},{
					text: "Format",
					width: 70,
					dataIndex: 't_format',
					sortable: true,
					hidden: true
				},{
					text: "Size",
					width: 50,
					dataIndex: 't_size',
					sortable: true
				},{
					text: "Date Created",
					width: 100,
					dataIndex: 't_create',
					sortable: true,
					renderer: formatDate
				},{
					xtype: 'checkcolumn',
					text: "Started",
					width: 70,
					dataIndex: 't_start',
					sortable: true,
					processEvent: function () { return false; } // set editable to false
				},{
					xtype: 'checkcolumn',
					text: "Finished",
					width: 70,
					dataIndex: 't_end',
					sortable: true,
					processEvent: function () { return false; } // set editable to false
				},{
	                text : 'tournament_id',
	                dataIndex : 'id',
	                hidden : true
	            },{
	                text : 'teams',
	                dataIndex : 'teams',
	                hidden : true
	            },{
	                text : 'results',
	                dataIndex : 'results',
	                hidden : true
	            }],
				forceFit: true,
				//height:210,
				split: true,
	            viewConfig : {
	                stripeRows : true
	            },
				listeners : {
	                select : tournament.grid.onSelect,
	                // itemcontextmenu : 
	                // itemdblclick :
	                // afterrender : 
	            },
			});
			return tournament.grid.object;
		},
		
		onSelect: function(rowModel, row, index) {
			bracket.show(row, index);
			
			var startBtn = Ext.getCmp("start-tournament-btn");
			if(!row.data.t_start) {
				startBtn.enable();
			} else {
				startBtn.disable();
			}
		},
		
		startSelected: function() {
			var json = tournament.grid.object.getSelectionModel().getSelection()[0].data;
			json.t_start = true;
			postData('tournaments', json, function(resp) {
				console.log("success");
			}, function(resp) {
				console.log("error");
			}, 'PUT');
		}
	}
};

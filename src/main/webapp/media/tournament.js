

Ext.define('TournamentModel',{
	extend: 'Ext.data.Model',
	fields: [ 
		{name: 't_name'},
		{name: 't_size'},
		{name: 't_format'},
		{name: 't_create'},
		{name: 't_start', type: 'bool'},
		{name: 't_end', type: 'bool'}
	]
});

var tournament = {
	teams: null,
	results: null,
	
	form: {
		object: null,
		
		create: function() {
			tournament.form.object = new Ext.form.Panel({
		        width:400,
		        height:400,
		        title:'New tournament',
		        floating:true,
		        closable:true,
		        hidden:false,
		        items:[
		            {
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
		                   { boxLabel: 'Single Elimination', name: 'rb', inputValue: '1', checked:true },
		                   { boxLabel: 'Double Elimination', name: 'rb', inputValue: '2'}
		               ]
		            }),
		            new Ext.form.RadioGroup({
		               id:'num_of_teams',
		               xtype:'radiogroup',
		               fieldLabel:'Team Count',
		               columns:3,
		               padding:10,
		               vertical:true,
		               items: [
		                    { boxLabel: '8', name: 'rb', inputValue: '1', checked:true },
		                    { boxLabel: '16', name: 'rb', inputValue: '2'},
		                    { boxLabel: '24', name: 'rb', inputValue: '3'},
		                    { boxLabel: '32', name: 'rb', inputValue: '4'},
		                    { boxLabel: '40', name: 'rb', inputValue: '5'},
		                    { boxLabel: '48', name: 'rb', inputValue: '6'}
		               ]
		            }),
		            new Ext.create('Ext.container.Container', {
		                layout: {
		                    type: 'hbox'
		                },
		                layoutConfig: {
		                    align:'middle'
		                },
		                width:300,
		                padding:20,
		                border:1,
		                items: [
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
		    
		    return tournament.form.object;
    	},
    	
    	save: function() {
    		// create json
    		var json = {};
    		
    		postData('tournaments', )
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
		}
	}
};

Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.panel.*',
    'Ext.layout.container.Border'
]);



Ext.onReady(function(){
    var data = [{id: 1, team_name: 'Hydras', elo:1300},
				{id: 2, team_name: 'Burglars', elo:1100},
				{id: 3, team_name: 'Tornados', elo:1600}];
				
	Ext.define('TeamModel',{
		extend: 'Ext.data.Model',
		/*proxy: {
			type: 'ajax',
			reader: 'json'
		},*/
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

    // create the grid
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
        
	/*	
    // define a template to use for the detail view
    var bookTplMarkup = [
        'Title: <a href="{DetailPageURL}" target="_blank">{Title}</a><br/>',
        'Author: {Author}<br/>',
        'Manufacturer: {Manufacturer}<br/>',
        'Product Group: {ProductGroup}<br/>'
    ];
    var bookTpl = Ext.create('Ext.Template', bookTplMarkup);
	*/
    Ext.create('Ext.Panel', {
        renderTo: 'main-container',
        frame: true,
        title: 'Book List',
        width: 580,
        height: 400,
        layout: 'border',
        items: [
            grid, /*{
                id: 'detailPanel',
                region: 'center',
                bodyPadding: 7,
                bodyStyle: "background: #ffffff;",
                html: 'Please select a book to see additional details.'
        }*/]
    });
    
    // update panel body on selection change
    grid.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
        if (selectedRecord.length) {
            var detailPanel = Ext.getCmp('detailPanel');
            detailPanel.update(bookTpl.apply(selectedRecord[0].data));
        }
    });

});
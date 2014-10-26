(function() {
    var cfg = Ext.Loader.getConfig();
    cfg.enabled = true;
    Ext.Loader.setConfig(cfg);
    Ext.Loader.setPath('MyApp', 'media/js');
    Ext.require([
	    'Ext.grid.*',
	    'Ext.data.*',
	    'Ext.panel.*',
	    'Ext.layout.container.Border',
	    
	    'Ext.layout.container.*',
        'Ext.resizer.Splitter',
        'Ext.fx.target.Element',
        'Ext.fx.target.Component',
        'Ext.window.Window',
	]);

    Ext.onReady(function() {
        Ext.create('Ext.app.LiveBracket');
        bracket.init();
    });
})();


Ext.define('Ext.app.LiveBracket', {

    extend: 'Ext.container.Viewport',
    requires: [],

    initComponent: function(){
        Ext.apply(this, {
            id: 'app-viewport',
            layout: {
                type: 'border',
                padding: '0 5 5 5'
            },
            items: [{
            	id: 'app-header',
            	xtype: 'panel',
            	region: 'north',
            	frame: false,
				border: false,
				header: false,
				bodyStyle: 'background:transparent;',
				// TODO: make header collapsible in a nice way
				// collapsible: true, 
				// hideCollapseTool:true,
            	height: 50,
	            layout : {
              		type : 'absolute',
              		align: 'top'
         	    },
            	items: [{
	                xtype : 'box',
	                x: 10,
	                html : '<div id="logo"><img src="media/img/blue-white-pearl-icon.png"></div>'
	            },{
	            	xtype : 'box',
	                x: 54,
	                html : '<div class="logo-text"><h1>Live&nbsp;Bracket</h1></div>'
	            },{
	            	xtype: 'button',
	            	scale: 'large',
	            	x: 275,
	            	y: 0,
	            	text: 'Create Tournament',
	            	listeners: {
	            		click: tournament.create
	            	}
	            }]
            },{
                xtype: 'container',
                region: 'center',
                layout: 'border',
                items: [{
                    id: 'app-accordion',
                    title: 'Manage',
                    region: 'east',
                    animCollapse: true,
                    width: 200,
                    minWidth: 150,
                    maxWidth: 400,
                    split: true,
                    collapsible: true,
                    layout:{
                        type: 'accordion',
                        animate: true
                    },
                    items: []
                },{
                    id: 'app-bracket',
                    xtype: 'panel',
                    region: 'center',
                    items: []
            	}]
            }]
        });
        this.callParent(arguments);
    }
});

var bracket = {
	init: function() {
		// Put items into the accordion panel
		var accordion = Ext.getCmp('app-accordion');
		accordion.add(tournament.createAccordionPanel());
		accordion.add(teams.createAccordionPanel());
		
		// TODO: Add the create tournament form, hidden
		
		
		// TODO: Add the bracket container
	}
};

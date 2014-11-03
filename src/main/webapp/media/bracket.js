(function() {
    var cfg = Ext.Loader.getConfig();
    cfg.enabled = true;
    Ext.Loader.setConfig(cfg);
    Ext.Loader.setPath('MyApp', 'media/js');
    Ext.Loader.setPath('Ext.ux.ajax', 'media/js');
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

        // Don't start up yet if we're testing from a file
        if(!isTest()) {
        	bracket.init();
        } else {
        	testMockAjax();
        }
    });
})();

// Determine if this is a local test so we can mock ajax if necessary
function isTest() {
	return window.location.protocol === 'file:' && window.location.href.substr(-9) === 'test.html';
}
x= null;
y = null;
function testMockAjax() {
   	Ext.Ajax.request = function(options) {
   		// options.method, params, url
   		var url = options.url.split("?")[0];
   		if(x==null) {
   			console.log(options);
   			x = 1;
   		}
   		
   		var data = [];
   		if(url == '/tournaments') {
   			data = [
	   			Ext.create('TournamentModel', {name: "Head Chef", create_date: "20141031123456"}),
   				Ext.create('TournamentModel', {name: "Big Wigg", create_date: "20141021123456", started: true, finished: true}),
	  			Ext.create('TournamentModel', {name: "Cat Competition",  create_date: "20141011123456", started: true})
	  		];
   		} else{
   			console.log("unrecognized ajax url: " + url);
   		}

   		
   		/*
        This shit dont work
   		var request = new MockHttpRequest();
		request.open("GET", url);
		request.setRequestHeader("Content-Type", "application/json");
		request.onload = function () {
			var json = this.responseText;
			console.log("Received response: " + this.statusText);
		    console.log("Response body: " + JSON.stringify(json));
		    //options.success(this);
			//options.complete(this);
			this.jsonData = json;
			this.responseJSON = json;
			this.setResponseHeader("Content-Type", "application/json");
			this.success = true;
			console.log(this);
			y = options.callback;
			options.callback(options, null, this);
		    //return this;
		};
		try {
			request.send("");
			request.receive(200, data);
		} catch(e) {
			console.log("error: " + e);
		}
		*/
		
		// This one does
        var me = this;
        options.callback({}, true, data);
        me.fireEvent('requestcomplete');
        
   	};
    bracket.init();
}

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

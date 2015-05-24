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
        	init();
        } else {
        	test.MockAjax();
        }
    });
})();

function init() {
	// Put items into the accordion panel
	var accordion = Ext.getCmp('app-accordion');
	accordion.add(tournament.panel.create());
	accordion.add(team.panel.create());

	// race condition with the GET call, adjust as needed
	setTimeout(function() {
		if(tournament.store.object.getCount() > 0) {
			tournament.grid.object.getSelectionModel().select(0);	
		}	
	}, 900);
	

}

// This is the main container for the page
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
	            	x: 272,
	            	y: 0,
	            	text: 'Create Tournament',
	            	listeners: {
	            		click: tournament.form.create
	            	}
	            },{
	            	xtype: 'button',
	            	id: 'start-tournament-btn',
	            	scale: 'large',
	            	x: 475,
	            	y: 0,
	            	text: 'Start Tournament',
	            	listeners: {
	            		click: tournament.grid.startSelected
	            	}
	            }]
            },
            {
                xtype: 'container',
                region: 'center',
                layout: 'border',
                items: [{
                    id: 'app-accordion',
                    title: 'Manage',
                    region: 'west',
                    animCollapse: true,
                    width: 460,
                    minWidth: 150,
                    maxWidth: 700,
                    split: true,
                    collapsible: true,
                    layout:{
                        type: 'accordion',
                        animate: true
                    },
                    listeners: {
                    	resize: function(obj, width, height) {
                    		if(width < 280) {
                    			width = 280;
                    		}
                    		var picker = Ext.getCmp('picker-panel');
                    		if(picker) {
                    			picker.setWidth(width);
                    		}
                    	}
                    },
                    items: []
                },{
                    xtype: 'panel',
                    region: 'center',
                    id: 'app-bracket',
                	overflowX: 'auto',
                	overflowY: 'auto',
                	items: [{
                		xtype: 'box',
						html: '<div id="bracket"><div class="bracket"></div></div>'
					}]
            	}]
            }]
        });
        this.callParent(arguments);
    }
});

function formatDate(dateStr) {
	if(!dateStr) {
		return '';
	}
	var year = dateStr.substr(0, 4);
	var mon = dateStr.substr(4, 2) ;
	var day = dateStr.substr(6, 2);
	
	return mon + '/' + day + '/' + year;
}

// Determine if this is a local test so we can mock ajax if necessary
function isTest() {
	return window.location.protocol === 'file:' && window.location.href.substr(-9) === 'test.html';
}

function postData(url, data, successFunc, errorFunc, alternateType) {
	var type = "POST";
	if(alternateType) {
		type = alternateType;
	}
	$.ajax({
		type : type,
		url : url,
		data : JSON.stringify(data),
		contentType : "application/json",
		accepts : "application/json",
		dataType : "json",
		success : successFunc,
		error : errorFunc,
		complete: successFunc  // HACK
	});
	return false;
}

function get(url, success, error, complete) {
	$.ajax({
		type : "GET",
		url : url,
		success: success,
		error: error,
		complete: complete
	});
}

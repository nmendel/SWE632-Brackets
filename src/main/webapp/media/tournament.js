
var tournament = {
	create: function() {
		console.log("new tournament");	
	},
	
	createAccordionPanel: function() {
		// TODO: need grid and stuff
		return Ext.create('Ext.panel.Panel', {
			html: "<div>content</div>",
            title:'Tournaments',
            autoScroll: true,
            border: false,
            iconCls: 'nav'
		});
	},
		
};
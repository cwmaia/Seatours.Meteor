Template.mainMenu.events({
	'click .logout' : function(){
		Meteor.logout();
		// Meteor.Router.to('/');
	},

	'click .nav li' : function(event) {
		Session.set('itemMenuId', event.currentTarget.id);
	}
})

Template.mainMenu.rendered = function(){
	if(Session.get('showOverview')){
		Session.set('showOverview', false);
		Meteor.Router.to('/overview');
	}

	if(Session.get('itemMenuId'))
		document.getElementById(Session.get('itemMenuId')).className += ' active';

	appendImage();
	handle_side_menu();
	general_things();
	//bootstrap v 2.3.1 prevents this event which firefox's middle mouse button "new tab link" action, so we off it!
	$(document).off('click.dropdown-menu');
}

Template.mainMenu.qtdItems = function(){
	return CartItems.find().count();
}
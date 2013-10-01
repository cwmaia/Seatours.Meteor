Template.userMenu.events({
	'click .logout' : function(){
		localStorage.removeItem('userId');
		Meteor.Router.to('/');
	}
})

Template.userMenu.rendered = function(){
	checkauth();
	appendImage();
	handle_side_menu();
	enable_search_ahead();	
	general_things();
	//bootstrap v 2.3.1 prevents this event which firefox's middle mouse button "new tab link" action, so we off it!
	$(document).off('click.dropdown-menu');
}
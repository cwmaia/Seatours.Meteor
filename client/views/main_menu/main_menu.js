Template.mainMenu.events({
	'click .logout' : function(){
		localStorage.removeItem('userId');
		Session.set('userId', null);
		Meteor.Router.to('/');
	}
})

Template.mainMenu.rendered = function(){
	if(Session.get('showOverview')){
		Session.set('showOverview', false);
		Meteor.Router.to('/overview');
	}

	$("#" + location.pathname.replace('/', '')).addClass('active');


	checkauth();
	appendImage();
	handle_side_menu();
	enable_search_ahead();	
	general_things();
	//bootstrap v 2.3.1 prevents this event which firefox's middle mouse button "new tab link" action, so we off it!
	$(document).off('click.dropdown-menu');
}


Template.mainMenu.events({
	
});
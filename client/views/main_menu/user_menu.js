Template.userMenu.events({
	'click .logout' : function(){
		localStorage.removeItem('userId');
		Meteor.Router.to('/');
	}
})
Template.mainMenu.events({
	'click .logout' : function(){
		localStorage.removeItem('userId');
		Meteor.Router.to('/');
	}
})
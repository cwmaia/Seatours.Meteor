Meteor.Router.add({
	'/login'  : function(page) {
		if(Session.get('userId'))
			Meteor.Router.to("/overview");
		
		return page;
	},
	'/overview' 	: 'overview',
	'/guest' 		: 'userMenu',
	'/adm'   		: 'mainMenu',
	'/createBook' 	: 'bookus',
	'/createAccount': 'createAccount',
	'/book' 		: 'book',
	'/bookReport' 	: 'bookReport',
	'/vehicles' 	: 'vehicles',
	'/boats' 		: 'boats',
	'/trips' 		: 'trips',
	'/bookOperator' : 'bookOperator',
	'/trips/:_id'	: {
		to 	: 'editTrip',
		and : function(id) {
			Session.set('tripId', id);
		}
	}
});

Meteor.Router.filters({
	'clearErrors' : function(page){
		clearErrors();
		clearSuccess();
		return page;
	},

	'checkAuth'	: function(page) {
		if(location.href != '' && Session.get('userId') == null)
			Meteor.Router.to("/login");
		return page;
	}
})

Meteor.Router.filter('clearErrors');
Meteor.Router.filter('checkAuth');

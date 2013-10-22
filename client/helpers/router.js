Meteor.Router.add({
	'/login'  : 'login',
	'/overview' : 'overview',
	'/guest' : 'userMenu',
	'/adm'   : 'mainMenu',
	'/createBook' : 'bookus',
	'/createAccount' : 'createAccount',
	'/book' : 'book',
	'/bookReport' : 'bookReport',
	'/vehicles' : 'vehicles',
});

Meteor.Router.filters({
	'clearErrors' : function(page){
		clearErrors();
		clearSuccess();
		return page;
	}
})

Meteor.Router.filter('clearErrors');
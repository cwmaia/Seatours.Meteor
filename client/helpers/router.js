Meteor.Router.add({
	'/' : 'login',
	'/login'  : 'login',
	'/guest' : 'userMenu',
	'/adm'   : 'mainMenu',
	'/createBook' : 'bookus',
	'/createAccount' : 'createAccount',
	'/book' : 'book',
	'/bookReport' : 'bookReport',
	'/vehicles' : 'vehicles',
	'/boats' : 'boats'
});

Meteor.Router.filters({
	'clearErrors' : function(page){
		clearErrors();
		clearSuccess();
		return page;
	}
})

Meteor.Router.filter('clearErrors');
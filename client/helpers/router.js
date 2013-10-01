Meteor.Router.add({
	'/' : 'login',
	'/login'  : 'login',
	'/guest' : 'userMenu',
	'/adm'   : 'mainMenu',
	'/createBook' : 'bookus',
	'/createAccount' : 'createAccount',
	'/book' : 'book'
});

Meteor.Router.filters({
	'clearErrors' : function(page){
		clearErrors();
		return page;
	}
})

Meteor.Router.filter('clearErrors');
Meteor.Router.add({
	'/login'  : 'login',
	'/overview' : 'overview',
	'/guest' : 'userMenu',
	'/adm'   : 'mainMenu',
	'/createBook' : 'bookus',
	'/createAccount' : 'createAccount',
	'/bookOperator' : 'bookOperator',
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
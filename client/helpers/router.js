Meteor.Router.add({
	'/login'  : function(page) {
		if(Meteor.user()){
			Meteor.Router.to("/overview");
		}	
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
	'/boats/:_id' 	: {
		to : 'editBoat',
		and: function(id) {
			Session.set('boatId', id);
		}
	},
	'/trips' 		: 'trips',
	'/bookOperator' : 'bookOperator',
	'/bookOperator/:_id' : {
		to : 'bookDetail',
		and: function(id){
			Session.set('productId', id);
		}
	},
	'/bookOperator/:_id/new' : {
		to : 'createBook',
		and: function(id){
			
		}
	},
	'/trips/:_id'	: {
		to 	: 'editTrip',
		and : function(id) {
			Session.set('tripId', id);
		}
	},
	'/voucher/:_id' : {
		to : 'voucher',
		and : function(id){
			Session.set('bookId', id);
		}
	},
	'/bookDetailResume/:_id' : {
		to: 'bookDetailResume',
		and : function(id){
			Session.set('bookId', id);
		}
	},
	'/management' :'management',
	'/cart'       : 'cart'
});

Meteor.Router.filters({
	'clearErrors' : function(page){
		clearErrors();
		clearSuccess();
		return page;
	},

	'checkAuth'	: function(page) {
		if(location.href != '' && Meteor.user() == null)
			Meteor.Router.to("/login");
		return page;
	}
})

Meteor.Router.filter('clearErrors');
Meteor.Router.filter('checkAuth');

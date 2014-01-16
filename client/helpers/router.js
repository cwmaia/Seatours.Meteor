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
			Session.set('productId', id);
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
	'/myVoucher/:_id' : {
		to: 'myVoucher',
		and : function(id){
			Session.set('bookId', id);
		}
	},
	'/management' :'management',
	'/cart'       : 'cart',
	'/bookEdit'   :'bookEdit',
	'/seasonControl'   :'seasonControl',
	'/finishBooking'   :'finishBooking',
	'/externView' : 'externView',
	'/createExternalUser' : 'createExternalUser',
	'/myBookings' : 'myBookings'
});

Meteor.Router.filters({
	'clearErrors' : function(page){
		clearErrors();
		clearSuccess();
		return page;
	},

	'checkAuth'	: function(page) {
		if(Meteor.user()){
			return page;
		}
	},

	'checkPermision' : function(page){

		if(!Meteor.user()){
			return;
		}


		var group = Groups.findOne({_id: Meteor.user().profile.groupID});

		//adm has all access
		if(group.name == 'Administrators')
			return page;

		for (var i = 0; i < group.permissions.length; i++) {
			if(group.permissions[i] == page){
				console.log(page);
				return page;
			}
		};

		alert('You have no permission to access this page, please consult your administrator!');
		return;


	}
})



Meteor.Router.filter('clearErrors');
Meteor.Router.filter('checkAuth');
Meteor.Router.filter('checkPermision');


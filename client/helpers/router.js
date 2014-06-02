Meteor.Router.add({
	'/login'  : function(page) {
		if(Meteor.user()){
			Meteor.Router.to("/overview");
		}
		return page;
	},
	'/myBookings/:orderId'   : {
		to : "myBookingsDetail",
		and : function(orderId){
			cleanExternView();
			Session.set("orderId", orderId);
			Session.set('myBookingsDetail', true);
			$("#loginArea").hide();
			Template.externView.rendered();
		}
	},
	'/listvouchers/:orderId'   : {
		to : "listvouchers",
		and : function(orderId){
			cleanExternView();
			Session.set("orderId", orderId);
			Session.set('hardCoded', true);
			Session.set('listvouchers', true);
			$("#loginArea").hide();
			Template.externView.rendered();
		}
	},
	'/cancelOrder'   : {
		to : "redirect",
		and : function(){
			bootbox.alert("You canceled the payment, to try again go to <b>My Orders</b> and select your order to pay");
		}
	},

	'/errorBorgun'   : {
		to : "redirect",
		and : function(){
			bootbox.alert("An error occurred with the External Payment System, please try again in a few moments");
		}
	},
	'/customers'    : 'customersAndExternals',
	'/waitingList'  : 'waitingList',
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
	'/myBookings' : 'myBookings',
	'/generalReport' : "generalReport"
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

		if(isCustomer()){
			return page;
		}


		var group = Groups.findOne({_id: Meteor.user().profile.groupID});
		if(group){
			//adm has all access
			if(group.name == 'Administrators')
				return page;

			for (var i = 0; i < group.permissions.length; i++) {
				if(group.permissions[i] == page){
					return page;
				}
			};

			bootbox.alert('You do not have the required permissions to access this page, please contact your administrator.');
			return;
		}


		return;


	},

	'edtingCustomer' : function(page){
		if(page == "customersAndExternals"){
			Session.set("editingCustomer", true);
			return page;
		}else{
			Session.set("editingCustomer", false);
			return page;
		}
	}
});




Meteor.Router.filter('clearErrors');
Meteor.Router.filter('checkAuth');
Meteor.Router.filter('checkPermision');
Meteor.Router.filter('edtingCustomer');

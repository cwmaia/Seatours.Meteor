Template.externView.selectDate = function(){
	return !Session.get('dateSelected') && !Session.get('cbasket') && !Session.get('creatingUser') && !Session.get('myBookings') && !Session.get('myVoucher') && !Session.get("finishBooking") && !Session.get("externalLogin") && !Session.get("paymentStep") && !Session.get('myBookingsDetail');
}

Template.externView.createBook = function(){
	return Session.get('dateSelected');
}

Template.externView.cart = function(){
	return Session.get('cbasket');
}

Template.externView.createUser = function(){
	return Session.get('creatingUser');
}

Template.externView.myBookings = function(){
	return Session.get('myBookings');
}

Template.externView.myBookingsDetail = function(){
	return Session.get('myBookingsDetail');
}

Template.externView.myVoucher = function(){
	return Session.get('myVoucher');
}

Template.externView.finishBooking = function(){
	return Session.get('finishBooking');
}

Template.externView.externalLogin = function(){
	return Session.get('externalLogin');
}

Template.externView.paymentStep = function(){
	return Session.get("paymentStep");
}



Template.externView.rendered = function(){
}

cleanExternView = function(){
	Session.set('cbasket', false);
	Session.set('dateSelected', false);
	Session.set('creatingUser', false);
	Session.set('myBookings', false);
	Session.set('myBookingsDetail', false);
	Session.set('myVoucher', false);
	Session.set('finishBooking', false);
	Session.set('externalLogin', false);
	Session.set('paymentStep', false);
}

Template.externView.events({
	'click .cbasket' : function(event){
		event.preventDefault();
		cleanExternView();
		Session.set('cbasket', true);
		$("#loginArea").hide();
		Template.externView.rendered();
	},

	'click .myBookings' : function(event){
		event.preventDefault();
		cleanExternView();
		Session.set('myBookings', true);
		$("#loginArea").hide();
		Template.externView.rendered();
	},

	'click .myBookingsDetail' : function(event){
		event.preventDefault();
		cleanExternView();
		Session.set('myBookingsDetail', true);
		$("#loginArea").hide();
		Template.externView.rendered();
	},
	
	'click .icoHome' : function(event){
		event.preventDefault();
		cleanExternView();
		$("#loginArea").hide();
		Template.externView.rendered();
	}

})
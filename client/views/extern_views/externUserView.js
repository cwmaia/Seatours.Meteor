Template.externView.selectDate = function(){
	return !Session.get('dateSelected') && !Session.get('cbasket') && !Session.get('creatingUser') && !Session.get('myBookings') && !Session.get('myVoucher');
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

Template.externView.myVoucher = function(){
	return Session.get('myVoucher');
}

Template.externView.rendered = function(){
}

cleanExternView = function(){
	Session.set('cbasket', false);
	Session.set('dateSelected', false);
	Session.set('creatingUser', false);
	Session.set('myBookings', false);
	Session.set('myVoucher', false);
}
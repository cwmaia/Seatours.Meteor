Template.externView.selectDate = function(){
	return !Session.get('dateSelected') && !Session.get('cbasket');
}

Template.externView.createBook = function(){
	return Session.get('dateSelected');
}

Template.externView.cart = function(){
	return Session.get('cbasket');
}
Template.externView.selectDate = function(){
	return !Session.get('dateSelected') && !Session.get('cbasket') && !Session.get('creatingUser');
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

Template.externView.rendered = function(){
}

cleanExternView = function(){
	Session.set('cbasket', false);
	Session.set('dateSelected', false);
	Session.set('creatingUser', false);
}
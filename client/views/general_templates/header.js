Template.header.loggedIn = function(){
	if(Meteor.user()){
      	return false;
  	}
    return true;
}

Template.header.rendered = function(){
	$("#loginArea").hide();
}

Template.header.loginName = function(){
	if(Meteor.user()){
		return Meteor.user().profile.name;
	}
		return "VISITOR";
}

Template.header.loggedAsUser = function(){
  	return isCustomer();
}

isCustomer = function(){
	if(Meteor.user()){
  		if(Groups.findOne({'_id': Meteor.user().profile.groupID}).name == "Customers"){
  			return true;
  		}
      	return false;
  	}
  	return true
}

Template.header.events({
	'click #createUser' : function(event){
		event.preventDefault();
	},
	'click #loginLink' : function(event){
		event.preventDefault();
		$("#loginArea").toggle();
	},
	'click .logoff' : function(event){
		event.preventDefault();
		Meteor.logout();
		SpinnerInit();
	},
	'click .cbasket' : function(event){
		event.preventDefault();
		Session.set('cbasket', true);
		Session.set('dateSelected', false);
		Template.externView.cart();
	},

	'click #id-logo' : function(event){
		event.preventDefault();
		Session.set('cbasket', false);
		Template.externView.cart();
	}

});
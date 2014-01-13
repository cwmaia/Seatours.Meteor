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

var isCustomer = function(){
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
	'click .logoff' : function(){
		Meteor.logout();
		SpinnerInit();
	}

});
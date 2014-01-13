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
		return "NEW USER";
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
	'click #loginLink' : function(event){
		event.preventDefault();
		$("#loginArea").toggle();
	}

});
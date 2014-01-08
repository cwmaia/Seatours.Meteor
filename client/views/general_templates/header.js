Template.header.loggedIn = function(){
	if(Meteor.user()){
      	return false;
  	}
    return true;
}

Template.header.rendered = function(){
	$("#loginArea").hide();
}

Template.header.events({
	'click #loginLink' : function(event){
		event.preventDefault();
		$("#loginArea").toggle();
	}

});
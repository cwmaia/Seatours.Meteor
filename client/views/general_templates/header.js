Template.header.loggedIn = function(){
	if(Meteor.user()){
      	return false;
  	}
    return true;
}

Template.header.rendered = function(){
	$("#loginArea").hide();
}

Template.header.totalItems = function(){
	return CBasket.find({cartId : getCartId()}).count();
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
		try{
			if(Groups.findOne({'_id': Meteor.user().profile.groupID}).name == "Customers"){
  			return true;
  		}
      		return false;
		}catch(err){
			console.log(err.message);
			return false;
		}
  		
  	}
  	return true;
}

isCustomerLogged = function(){
	if(Meteor.user()){
		try{
			if(Groups.findOne({'_id': Meteor.user().profile.groupID}).name == "Customers"){
  			return true;
  		}
      		return false;
		}catch(err){
			console.log(err.message);
			return false;
		}
  		
  	}
  	return false;
}

isCustomerNotLogged = function(){
	if(Meteor.user()){
		return false;
  	}
  	return true;
}

Template.header.events({
	'click #createUser' : function(event){
		event.preventDefault();
		cleanExternView();
		Session.set("creatingUser", true);
		$("#loginArea").toggle();
		$('.profile').toggle();
		Template.externView.rendered();
	},
	'click #loginLink' : function(event){
		event.preventDefault();
		$("#loginArea").toggle();
		$('.profile').toggle();
	},
	'click .logoff' : function(event){
		event.preventDefault();
		cleanExternView();
		Meteor.logout();
		SpinnerInit();
	},
	'click .cbasket' : function(event){
		event.preventDefault();
		cleanExternView();
		Session.set('cbasket', true);
		$("#loginArea").hide();
		$('.profile').show();
		Template.externView.rendered();
	},

	'click .myBookings' : function(event){
		event.preventDefault();
		cleanExternView();
		Session.set('myBookings', true);
		$("#loginArea").hide();
		$('.profile').show();
		Template.externView.rendered();
	},

	'click #id-logo' : function(event){
		event.preventDefault();
		cleanExternView();
		$("#loginArea").hide();
		$('.profile').show();
		Template.externView.rendered();
	}

});
Template.header.loggedIn = function(){
	if(Meteor.user()){
      	return false;
  	}
    return true;
}

Template.header.rendered = function(){
	$("#loginArea").hide();
	$("#sendPasswordMail").hide();
}

Template.header.totalItems = function(){
	return CartItems.find({cartId : getCartId()}).count();
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
			if(Meteor.user().profile.groupID){
				return false;
			}else{
				return true;
			}
		}catch(err){
			console.log(err.message);
			return false;
		}
  		
  	}
  	return true;
}

isOperator = function(){
	if(Meteor.user()){
		try{
			if(Meteor.user().profile.groupID){
				return true;
			}else{
				return false;
			}
		}catch(err){
			console.log(err.message);
			return false;
		}
  		
  	}
  	return false;
}

isCustomerLogged = function(){
	if(Meteor.user()){
		try{
			if(Meteor.user().profile.groupID){
				return false;
			}else{
				return true;
			}
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
		if($("#loginArea").is(":visible")){
			$("#loginArea").hide();
		}else{
			$("#loginArea").show();
		}
		if($('.profile').is(":visible")){
			$('.profile').hide();
		}else{
			$('.profile').show();
		}
		Template.externView.rendered();
	},

	'click #forgetPassword' : function(event){
		if($("#loginArea").is(":visible")){
			$("#loginArea").hide();
		}else{
			$("#loginArea").show();
		}
		if($('.profile').is(":visible")){
			$('.profile').hide();
		}else{
			$('.profile').show();
		}
		$("#sendPasswordMail").show();
	},

	'click #loginLink' : function(event){
		event.preventDefault();
		
		if($('.profile').is(":visible")){
			$('.profile').hide();
		}else{
			$('.profile').show();
		}
		if($("#loginArea").is(":visible")){
			$("#loginArea").hide();
		}else{
			$("#loginArea").show();
		}
	},
	'click .logoff' : function(event){
		Meteor.Router.to('/');
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
	},

	'click .homeBtn' : function(event){
		event.preventDefault();
		cleanExternView();
		$("#loginArea").hide();
		$('.profile').show();
		Template.externView.rendered();
	},

	'click .login-button' : function(event){
		cleanExternView();
		$("#loginArea").hide();
	},

	'click .close' : function(){
		$("#sendPasswordMail").hide();
	},

	'submit #sendPassword' : function(event){
		event.preventDefault();

		form = event.target;

		var options = {
			email : form.emailToSendPassword.value
		}

		$("#sendPasswordMail").hide();
		$.blockUI({message : 'Please Wait'});
		Accounts.forgotPassword(options, function(err){
			if(err){
				console.log(err.reason);
				throwError('Looks like our server is busy, try again in a few moments');
				$.unblockUI();
			}else{
				$.unblockUI({
					onUnblock : function(){ bootbox.alert("An email has been sent with instructions to reset your password")}
				});
			}
			
		});
	},



	

});
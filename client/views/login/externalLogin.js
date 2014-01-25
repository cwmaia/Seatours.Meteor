Template.externalLogin.rendered = function(){
	if(isCustomerNotLogged()){
		books = CBasket.find({cartId: getCartId()}).fetch();
		book = books[0];
		customer = Customers.findOne(book.customerId);
		$('#customerFullname').val(customer.fullName);
		$("#customerEmail").val(customer.email);
	}
}

Template.externalLogin.events({
	'click .continueLogged' : function(event){
		event.preventDefault();

		SpinnerInit();

		username = $("#customerUsername").val();
		password = $("#customerPassword").val();

		var user = {
			username : username,
			password : password
		}

		Meteor.loginWithPassword(user.username, user.password, function(err){
	        if (err){
	        	if(err.reason == 'Incorrect password')
	        		throwError("Incorrect Password!") 
	        	else
	        		throwError("User not Found!") 
	        	SpinnerStop();
	        }else{
	        	cleanExternView();
				Session.set('finishBooking', true);
				$("#loginArea").hide();
				Template.externView.rendered();
	        }
		});
	},

	'click .continueCreate' : function(event){
		event.preventDefault();

		fullName = $("#customerFullname").val();
		email = $("#customerEmail").val();

		if(!fullName){
			throwError("Please provide your full name");
			return;
		}

		if(!email){
			throwError("Please provide your email");
			return;
		}

		cleanExternView();
		Session.set('fullCustomerNameCreation', fullName);
		Session.set('emailCustomerCreation', email);

		Session.set('finishBooking', true);
		$("#loginArea").hide();
		Template.externView.rendered();
	}

})	
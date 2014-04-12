Template.externalLogin.rendered = function(){
	if(isCustomerNotLogged()){
		books = CartItems.find({cartId: getCartId()}).fetch();
		book = books[0];
		customer = Customers.findOne(book.customerId);
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
	},
	'click .continueNoAcc' : function(event){
		event.preventDefault();

		email = $("#emailNoLogin").val();

		if(!email){
			throwError("Please provide your email");
			return;
		}



		books = CartItems.find({cartId: getCartId()}).fetch();

//		customerId = "NotACustomer"
		refNumber = new Date().getTime().toString().substr(1);
		while(Orders.findOne({refNumber : refNumber})){
			refNumber = new Date().getTime().toString().substr(1);
		}
		Orders.insert({paid: false, dateOrder: new Date(), refNumber: refNumber});
		
		//Save Bookings
		for (var i = 0; i < books.length; i++) {
			delete books[i].cartId;
			books[i].orderId = refNumber;
			books[i].bookStatus = "Waiting Payment (credit card)";
			Meteor.call('insertBook', books[i]);
			CartItems.remove({_id: books[i]._id});
		};

		cleanExternView();
		Session.set('paymentStep', true);
		Session.set('orderId', refNumber);
		$("#loginArea").hide();
		Template.externView.rendered();
		Session.set('emailNoLogin', email);
	}

})	
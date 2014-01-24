

Template.finishBookCustomer.rendered = function(){
	if(isCustomerNotLogged()){
		
		books = CBasket.find({cartId: getCartId()}).fetch();
		book = books[0];
		customer = Customers.findOne(book.customerId);
		$('#fullName').val(customer.fullName);
		$("#email").val(customer.email);
		$('#socialSecurityNumber').val(customer.socialSecurityNumber);
		$('#title').val(customer.title);
		$('#birthDate').val(customer.birthDate);
		$('#telephoneCode').val(customer.telephoneCode);
		$('#telephone').val(customer.telephone);
		$('#adress').val(customer.adress);
		$('#city').val(customer.city);
		$('#state').val(customer.state);
		$('#postcode').val(customer.postcode);
		$('#country').val(customer.country);

	}
}



Template.finishBookCustomer.customerLogged = function(){
	return isCustomerLogged();
}

Template.finishBookCustomer.customerName = function(){
	return Meteor.user().profile.name;
}

Template.finishBookCustomer.customerEmail = function(){
	var currentCustomer = Customers.findOne({'_id' : Meteor.user().profile.customerId});
	return currentCustomer.email;
}

Template.finishBookCustomer.customerTelephone = function(){
	var currentCustomer = Customers.findOne({'_id' : Meteor.user().profile.customerId});
	return currentCustomer.telephone;
}

Template.finishBookCustomer.customerAddress = function(){
	var currentCustomer = Customers.findOne({'_id' : Meteor.user().profile.customerId});
	return currentCustomer.adress + ' ' + currentCustomer.city + ' ' + currentCustomer.state + ' ' + currentCustomer.postcode;
}

Template.finishBookCustomer.events({
		'click #finishBuyBookingCustomer' : function(){
		if(isCustomerLogged()){
			books = CBasket.find({cartId: getCartId()}).fetch();

			customerId = Meteor.user().profile.customerId;
			refNumber = new Date().getTime().toString().substr(1);
			while(Orders.findOne({refNumber : refNumber})){
				refNumber = new Date().getTime().toString().substr(1);
			}
			Orders.insert({customerId: customerId, paid: false, dateOrder: new Date(), refNumber: refNumber});
			
			//Save Bookings
			for (var i = 0; i < books.length; i++) {
				delete books[i].cartId;
				books[i].buyerId = customerId;
				books[i].orderId = refNumber;
				books[i].bookStatus = "Waiting Payment";
				Meteor.call('insertBook', books[i]);
				CBasket.remove({_id: books[i]._id});
			};

			cleanExternView();
			Session.set('paymentStep', true);
			Session.set('orderId', refNumber);
			$("#loginArea").hide();
			Template.externView.rendered();
		}else{
			var form = document.getElementById('pasagerInfo');
			if(form.checkValidity()){
				//Gather Customer Data
				var customerData = {
					'socialSecurityNumber' : $('#socialSecurityNumber').val(),
					'fullName' :  $('#fullName').val(),
					'title' : $('#title').val(),
			    	'birthDate': $('#birthDate').val(),
			    	'email' : $('#email').val(),
			    	'telephoneCode' : $('#telephoneCode').val(),
			    	'telephone' : $('#telephone').val(),
			    	'adress' : $('#adress').val(),
			    	'city' : $('#city').val(),
			    	'state' : $('#state').val(),
			    	'postcode' : $('#postcode').val(),
			    	'country' : $('#country').val()
				}

				var user = {
					username : $('#email').val(),
					email : $('#email').val(),
					password : $('#firstPasswordToEnter').val()
				}

				Meteor.call('createExternalAccount', user, customerData, function(err, result){
					if(err){
						throwError("Email already registered!");
						return;
					}else{
						books = CBasket.find({cartId: getCartId()}).fetch();
						refNumber = new Date().getTime().toString().substr(1);
						while(Orders.findOne({refNumber : refNumber})){
							refNumber = new Date().getTime().toString().substr(1);
						}
						Orders.insert({customerId: result, paid: false, dateOrder: new Date(), refNumber: refNumber});
						//Save Books
						for (var i = 0; i < books.length; i++) {
							delete books[i].cartId;
							books[i].buyerId = result;
							books[i].orderId = refNumber;
							books[i].bookStatus = "Waiting Payment";
							Meteor.call('insertBook', books[i]);
							CBasket.remove({_id: books[i]._id});
						};

						Meteor.loginWithPassword(user.username, user.password, function(err){
					        if (err){
					        	if(err.reason == 'Incorrect password')
					        		throwError("Incorrect Password!") 
					        	else
					        		throwError("User not Found!") 
					        	SpinnerStop();
					        }else{
					        	cleanExternView();
								Session.set('paymentStep', true);
								Session.set('orderId', refNumber);
								$("#loginArea").hide();
								Template.externView.rendered();
					        }
						});
					}
				})		
			}else{
				throwError("Some informations are wrong, please fix them. (Forgot something?)");
				$('#pasagerInfo').submit(function(event){
					event.preventDefault();
				});
			}
		}
		
	}
})
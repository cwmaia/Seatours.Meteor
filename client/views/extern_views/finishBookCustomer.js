

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
		$('#adress').val(customer.address);
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
				books[i].bookStatus = "Waiting Payment (credit card)";
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
			    	'address' : $('#adress').val(),
			    	'city' : $('#city').val(),
			    	'state' : $('#state').val(),
			    	'postcode' : $('#postcode').val(),
			    	'country' : $('#country').val()
				}

				var user = {
					username : form.username.value,
					email : $('#email').val(),
					password : $('#firstPasswordToEnter').val()
				}
				SpinnerInit();
				Meteor.call('createExternalAccount', user, customerData, function(err, result){
					if(err){
						throwError(err.reason);
						SpinnerStop();
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
							books[i].bookStatus = "Waiting Payment (credit card)";
							Meteor.call('insertBook', books[i]);
							CBasket.remove({_id: books[i]._id});
						};
						SpinnerStop();
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
				$('#pasagerInfo').submit(function(event){
					event.preventDefault();
				});
				if(!$("#title").val())
					showPopover($("#title"), 'This value is required');
				if(!$("#fullName").val())
					showPopover($("#fullName"), 'This value is required');
				if(!$("#birthDate").val())
					showPopover($("#birthDate"), 'This value is required');
				if(!$("#email").val())
					showPopover($("#email"), 'Please provide a valid email');
				if($("#email").val().indexOf("@") <= 0  ||  $("#email").val().lastIndexOf(".") < $("#email").val().indexOf("@") )
					showPopover($("#email"), 'Please provide a valid email');
				if(!$("#telephone").val())
					showPopover($("#telephone"), 'This value is required');
				if(!$("#username").val())
					showPopover($("#username"), 'This value is required');
				if(!$("#password").val())
					showPopover($("#password"), 'This value is required');
				if(!$("#confirmPassword").val())
					showPopover($("#confirmPassword"), 'This value is required');
				if($("#confirmPassword").val()!=$("#password").val())
					showPopover($("#confirmPassword"), 'Must match your password');
				if(!$("#adress").val())
					showPopover($("#adress"), 'This value is required');
				if(!$("#postcode").val())
					showPopover($("#postcode"), 'This value is required');
				if(!$("#city").val())
					showPopover($("#city"), 'This value is required');
				if(!$("#country").val())
					showPopover($("#country"), 'This value is required');

			}
		}
		
	}
})
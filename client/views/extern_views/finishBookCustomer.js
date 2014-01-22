Template.finishBookCustomer.getCBasket = function(){
	return CBasket.find({cartId : getCartId()});
}

Template.finishBookCustomer.rendered = function(){
	if(isCustomerNotLogged()){
		$('#fullName').val(Session.get('fullCustomerNameCreation'));
		$("#email").val(Session.get('emailCustomerCreation'));
	}
}

Template.finishBookCustomer.cbasketBooks = function(){
	return CBasket.find({cartId : getCartId()});
}

Template.finishBookCustomer.totalCustomer = function(){
	var carts = CBasket.find({cartId : getCartId()}).fetch();
	var total = 0;
	for (var i = 0; i < carts.length; i++) {
		total += parseInt(carts[i].totalISK);
	};
	return total;
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

			orderID = Orders.insert({customerId: customerId});
			//REMOVE ONLY TEST!!!
			localStorage.setItem("orderIDTeste", orderID);
			//$("#urlSuccess").val("http://localhost:3000/ReturnPageSuccess?orderId\="+orderID);
			$("#orderIdInput").val(orderID);
			//Save Books
			for (var i = 0; i < books.length; i++) {
				delete books[i].cartId;
				books[i].buyerId = customerId;
				books[i].orderId = orderID;
				Meteor.call('insertBook', books[i]);
				CBasket.remove({_id: books[i]._id});
			};

			$("#sendToBorgun").submit();
			/*
			cleanExternView();
			Session.set('myBookings', true);
			$("#loginArea").hide();
			Template.externView.rendered();*/
		}else{
			var form = document.getElementById('pasagerInfo');
			if(form.checkValidity()){
				//Gather Customer Data
				var customerData = {
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

						orderID = Orders.insert({customerId: result});
						//REMOVE ONLY TEST!!!
						localStorage.setItem("orderIDTeste", orderID);
						//$("#urlSuccess").val("http://localhost:3000/ReturnPageSuccess?orderId="+result);
						$("#orderIdInput").val(orderID);

						//Save Books
						for (var i = 0; i < books.length; i++) {
							delete books[i].cartId;
							books[i].buyerId = result;
							books[i].orderId = orderID;
							books[i].bookStatus = "Waiting Payment";
							Meteor.call('insertBook', books[i]);
							CBasket.remove({_id: books[i]._id});
						};

						$("#sendToBorgun").submit();

						/*Meteor.loginWithPassword(user.username, user.password, function(err){
					        if (err){
					        	if(err.reason == 'Incorrect password')
					        		throwError("Incorrect Password!") 
					        	else
					        		throwError("User not Found!") 
					        	SpinnerStop();
					        }else{
					        	cleanExternView();
								Session.set('myBookings', true);
								$("#loginArea").hide();
								Template.externView.rendered();
					        }
						});*/
					}
				})		
			}else{
				$('#pasagerInfo').submit(function(event){
					event.preventDefault();
				});
			}
		}
		
	}
})
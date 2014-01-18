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
			//Save Books
			for (var i = 0; i < books.length; i++) {
				delete books[i].cartId;
				books[i].buyerId = customerId;
				Meteor.call('insertBooks', books[i]);
				CBasket.remove({_id: books[i]._id});
			};
			cleanExternView();
			Session.set('myBookings', true);
			$("#loginArea").hide();
			Template.externView.rendered();
		}else{
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
			//Gather User Data
			customerId = Customers.insert(customerData);
			group = Groups.findOne({"name": "Customers"});
    		
			user = {
				username : a,
				password : b,
				email : c,
				profile : {'groupID': group._id, 'name' : fullName},
			}

			books = CBasket.find({cartId: getCartId()}).fetch();
			//Save Books
			for (var i = 0; i < books.length; i++) {
				delete books[i].cartId;
				books[i].buyerId = customerId;
				Meteor.call('insertBooks', books[i]);
				CBasket.remove({_id: books[i]._id});
			};

			Accounts.crateAccount(user);
			cleanExternView();
			Session.set('myBookings', true);
			$("#loginArea").hide();
			Template.externView.rendered();
		}
		
	}
})
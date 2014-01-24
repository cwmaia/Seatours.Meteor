Template.paymentStep.cbasketBooks = function(){
	return Books.find({orderId : Session.get('orderId')});
}

Template.paymentStep.totalCustomer = function(){
	/*var carts = Books.find({orderId : Session.get('orderId')}).fetch();
	var total = 0;
	for (var i = 0; i < carts.length; i++) {
		total += parseInt(carts[i].totalISK);
	};*/
	total = 100;
	count = Books.find({orderId : Session.get('orderId')}).count();
	return total * count;
}

Template.paymentStep.basket = function(){
	var html= '';
	var total = 0;
	books = Books.find({orderId : Session.get('orderId')}).fetch();
	for (var i = 0; i < books.length; i++) {
		html += '<input type="hidden" name="itemdescription_'+[i]+'" value="Seatours Ticket: '+books[i].product.name + ' - From '+ books[i].trip.from + ' '+books[i].trip.to+' '+books[i].trip.hour+'" /><br>'; 
		html += '<input type="hidden" name="itemcount_'+[i]+'" value="1" /><br>'; 
		html += '<input type="hidden" class="amountBorgun" name="itemunitamount_'+[i]+'" value="'+100+'" /><br>'; 
		html += '<input type="hidden" class="amountBorgun" name="itemamount_'+[i]+'" value="'+100+'" /><br>';
		total = parseInt(total + 100);
	};
	
	return html;
}

Template.paymentStep.customerName = function(){
	return Meteor.user().profile.name;
}

Template.paymentStep.customerEmail = function(){
	var currentCustomer = Customers.findOne({'_id' : Meteor.user().profile.customerId});
	return currentCustomer.email;
}

Template.paymentStep.getCBasket = function(){
	return CBasket.find({cartId : getCartId()});
}

Template.paymentStep.orderId = function(){
	return Session.get('orderId');
}

Template.paymentStep.events({
	'click #proccedToPayment' : function(){
		event.preventDefault();
		cleanExternView();
		$("#loginArea").hide();
		$('.profile').show();
		
		$("#sendToBorgun").submit();
		Template.externView.rendered();
	}
})
	

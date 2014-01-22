Template.paymentStep.cbasketBooks = function(){
	return Books.find({orderId : Session.get('orderId')});
}

Template.paymentStep.totalCustomer = function(){
	var carts = Books.find({orderId : Session.get('orderId')}).fetch();
	var total = 0;
	for (var i = 0; i < carts.length; i++) {
		total += parseInt(carts[i].totalISK);
	};
	return total;
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
		$(".amountBorgun").val(500);
		$("#sendToBorgun").submit();
		Template.externView.rendered();
	}
})
	

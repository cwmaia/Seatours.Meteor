Template.paymentStep.cbasketBooks = function(){
	console.log("aqui");
	console.log(Session.get('orderId'));
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
		tripTo = "";
		if(books[i].trip.to){
			tripTo = books[i].trip.to;
		}
		html += '<input type="hidden" name="itemdescription_'+[i]+'" value="Seatours Ticket: '+books[i].product.name + ' - From '+ books[i].trip.from + ' '+ tripTo +' '+books[i].trip.hour+'" /><br>'; 
		html += '<input type="hidden" name="itemcount_'+[i]+'" value="1" /><br>'; 
		html += '<input type="hidden" class="amountBorgun" name="itemunitamount_'+[i]+'" value="'+100+'" /><br>'; 
		html += '<input type="hidden" class="amountBorgun" name="itemamount_'+[i]+'" value="'+100+'" /><br>';
		total = parseInt(total + 100);
	};
	
	return html;
}

Template.paymentStep.baseURL = function(){
	return window.location.host;
}

Template.paymentStep.customerName = function(){
	return Meteor.user().profile.name;
}

Template.paymentStep.customerEmail = function(){
	var currentCustomer = Customers.findOne({'_id' : Meteor.user().profile.customerId});
	return currentCustomer.email;
}

Template.paymentStep.getCBasket = function(){
	return CartItems.find({cartId : getCartId()});
}

Template.paymentStep.orderId = function(){
	return Session.get('orderId');
}

Template.paymentStep.rendered = function(){
	$(".formattedAsMoney").maskMoney({thousands:'.', allowNegative:'true', precision:'0'});
  	$(".formattedAsMoney").maskMoney('mask');
  	if(!Meteor.user()){
  		$("#emailBorgun").attr('value',Session.get('emalNoLogin'));
  	}
}

Template.paymentStep.events({
	'click #proccedToPayment' : function(){
		event.preventDefault();
		bookings = Books.find({orderId : Session.get('orderId')}).fetch();

		Session.set("checkOrder", true);
		for (var i = 0; i < bookings.length; i++) {

			var date = bookings[i].dateOfBooking;

			with(date){
				setHours(0);
				setMinutes(0);
				setSeconds(0);
				setMilliseconds(0);
			}

			var dateToday = new Date();
			with(dateToday){
				setHours(0);
				setMinutes(0);
				setSeconds(0);
				setMilliseconds(0);
			}

			if(date < dateToday){
				bootbox.alert("Sorry but at least one booking date is invalid");
				return;
			}

			localStorage.setItem('date', date);

			persons = 0;

			for (var j = 0; j < bookings[i].prices.length; j++) {
				if(bookings[i].prices[j].price != "Operator Fee")
					persons = parseInt(parseInt(bookings[i].prices[j].persons) + persons);
			};

			if(!checkMaxCapacity(persons, bookings[i].product._id, bookings[i].trip._id)){
				bootbox.alert("Sorry but we have no more free sits on the boat");
				return;
			}
		};
		
		cleanExternView();
		$("#loginArea").hide();
		$('.profile').show();
		Session.set("checkOrder", null);
		$("#sendToBorgun").submit();
		Template.externView.rendered();
	}
})
	

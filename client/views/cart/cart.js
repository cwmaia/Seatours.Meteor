Template.cart.cartBooks = function(){
	return CartItems.find({cartId : getCartIdOperator()});
};

Template.cart.hasItems = function(){
	if(CartItems.find({cartId : getCartIdOperator()}).count() > 0){
		return true;
	}else{
		return false;
	}
};

Template.items.calcTotalISK = function(bookId){
	var book = CartItems.findOne(bookId);
	var totalISK = 0;
	var confirmationFee = 0;
	if(book){
			totalISK = book.totalISK;
			for(var i = 0; i < book.prices.length; i++){
				if(book.prices[i].price.toLowerCase() == 'confirmation fee'){
					confirmationFee = parseInt(book.prices[i].perUnit);
				}
			}
	}

	return totalISK - confirmationFee;
};

Template.items.flatey = function(id){
	note = Notes.findOne({bookId : id, type : "Stop at flatey"});
	if(note)
		return true;
	else
		return false;
};

Template.items.confirmationFeeNotLogin = function(){
	return isCustomer();
};

Template.items.baseURL = function(){
	return window.location.host;
};

Template.items.basket = function(id){
	var html= '';

	var book = CartItems.findOne(id);
	if(book){
		html += '<input type="hidden" name="itemdescription_0" value="Seatours Ticket: '+book.product.name + ' - From '+ book.trip.from + ' '+ book.trip.to +' '+book.trip.hour+'" /><br>';
		html += '<input type="hidden" name="itemcount_0" value="1" /><br>';
		html += '<input type="hidden" class="amountBorgun" name="itemunitamount_0" value="'+book.totalISK+'" /><br>';
		html += '<input type="hidden" class="amountBorgun" name="itemamount_0" value="'+book.totalISK+'" /><br>';
	}
	return html;
};




Template.cart.rendered = function(){
	$(".formattedAsMoney").maskMoney({thousands:'.', allowNegative:'true', precision:'0'});
  	$(".formattedAsMoney").maskMoney('mask');
}

Template.items.hasDiscount = function(){
	if(this.discount)
		return this.discount > 0;
	else
		return false;
}

Template.items.hasTo = function(){
	return this.trip.to;
}

Template.items.notFinish = function(){
	return !Session.get('paymentStep');
}

Template.items.customer = function(){
	return isCustomer();
}

Template.cart.getCBasket = function(){
	if(CartItems.find({cartId : getCartId()})){
		return true;
	}else{

		return false;
	}

};

Template.items.hasVehicle = function(){
	return this.vehicle.category;
};

Template.cart.cbasketBooks = function(){
	return CartItems.find({cartId : getCartId()});
};

Template.cart.customer = function(){
	return isCustomer();
};

Template.cart.total = function(){
	var carts = CartItems.find({cartId : getCartIdOperator()}).fetch();
	var total = 0;
	var totalConfirmationsFee = 0;
	for (var i = 0; i < carts.length; i++) {
		total += parseInt(carts[i].totalISK);

		for(var j = 0; j < carts[i].prices.length; j++){
			if(carts[i].prices[j].price.toLowerCase() == 'confirmation fee'){
				totalConfirmationsFee += parseInt(carts[i].prices[j].perUnit);
			}
		}

	}

	return total - totalConfirmationsFee;

};


Template.items.dateNoTimeZone = function(date){
	return date.toUTCString().slice(5,17);
};

Template.cart.totalCustomer = function(){
	var carts = CartItems.find({cartId : getCartId()}).fetch();
	var total = 0;
	for (var i = 0; i < carts.length; i++) {
		total += parseInt(carts[i].totalISK);
	}
	return total;
};

Template.items.customerName = function(customerId){
	var customer = Customers.findOne({_id : customerId});
	if(customer)
		return customer.fullName;
	return "";
};

Template.items.customerEmail = function(customerId){
	var customer = Customers.findOne({_id : customerId});
	if(customer)
		return customer.email;
	return "";
};

Template.cart.disableCheckout = function(){
	if(!isCustomer() && CartItems.find().count() > 0){
		return false;
	}else if(isCustomer() && CartItems.find().count() > 0){
		return false;
	}else{
		return true;
	}
};



Template.cart.events({
	'click .checkout' : function(event){
		event.preventDefault();
		if(isCustomerNotLogged()){
			//Show Login Screen
			book = checkVehicles();
			if(book){
				bootbox.alert("The vehicle "+book.vehicle.vehicleName +" ("+book.vehicle.vehiclePlate+") informed on the book with destination to: "+book.trip.to+" from: "+book.trip.from+" "+book.trip.hour+" was already booked!")
				return;
			}else{
				cleanExternView();
				Session.set('externalLogin', true);
				$("#loginArea").hide();
				Template.externView.rendered();
			}

		}else if(isCustomerLogged()){
			//Show Confirm Purchase
			cleanExternView();
			Session.set('finishBooking', true);
			$("#loginArea").hide();
			Template.externView.rendered();
		}else{
			var books = CartItems.find({cartId : getCartIdOperator()}).fetch();
			var createdBooks = [];
			for (var i = 0; i < books.length; i++) {
				var customer = Customers.findOne({_id : books[i].customerId});

				if(customer.email)
					sendMail(books[i],books[i]._id, customer);

				CartItems.remove({_id : books[i]._id});

				refNumber = new Date().getTime().toString().substr(5);
				while(Books.findOne({refNumber : refNumber})){
					refNumber = new Date().getTime().toString().substr(5);
				}
				books[i].refNumber = refNumber;
				books[i].buyerId = books[i].customerId;
				bookId = Books.insert(books[i]);
				createdBooks[i] = Books.findOne({_id : bookId});
				//UpdateNote
				notes = Notes.find({bookId: books[i]._id}).fetch();
				console.log(notes);
				for(var j = 0; j < notes.length; j++){
					Notes.update(notes[j]._id, {$set : {bookId: bookId}});
				}

				historyBook = HistoryBook.findOne({bookId: books[i]._id});
				if(history)
					HistoryBook.update(historyBook._id, {$set : {bookId: bookId}});
		}

		throwSuccess(books.length+' Bookings Created!');
		Session.set("createdBooks", createdBooks);
		Meteor.Router.to("/bookOperator");
		}


	}
});

var checkVehicles = function(){
	var books = CartItems.find({cartId : getCartId()}).fetch();
	var check = false;

	for (var i = 0; i < books.length; i++) {
		if(books[i].vehicle){
			check = checkSameCarOnBoat(books[i].vehicle.vehiclePlate, books[i].product._id, books[i].trip._id, books[i].dateOfBooking);
			if(check){
				return books[i];
			}
		}
	}

	return check;

}

Template.items.events({
	'change .number' : function(event){
		var totalParcial = event.currentTarget.value * this.totalISK;
		$('#'+this._id).text(totalParcial);
		calcTotalItems();
	},
	'click .remove' : function(event){
		var link = event.currentTarget;

		CartItems.remove(link.rel);

		//Remove all notes
		var notes = Notes.find({bookId: link.rel}).fetch();
		for (var i = 0; i < notes.length; i++) {
			Notes.remove(notes[i]._id);
		};

		throwInfo('Item Removed');
	},

	'click .editBook' : function(event){
		var link = event.currentTarget;
		Session.set('isEditing', true);
		Session.set("firstTime", true);
		Session.set("firstTimePrice", true);
		book = CartItems.findOne({_id: link.rel});
		product = Products.findOne({_id: book.product._id});
		Session.set("customerId", book.customerId);
		Session.set("productId", product._id);
		Session.set("bookingDate", book.dateOfBooking);
		Session.set('tripId', book.trip._id);
		Meteor.Router.to('/bookEdit');
	},

	'click .payAtBorgun' : function(event){
		event.preventDefault();
		$("#sendToBorgun").submit();
	},

	'click .quickPay' : function(event){
		event.preventDefault();
		var a = event.currentTarget;
		bootbox.confirm('Are you sure? Clicking this will make the Booking Paid', function(confirm){
			if(confirm){
					var bookId = a.rel;
					var currentBooking = CartItems.findOne({'_id' : bookId});
					var vendor = Meteor.user().profile.name;
					var transaction = {
						'bookId' : currentBooking._id,
						'date' : new Date(),
						'status' : 'Given',
						'amount' : parseInt(currentBooking.totalISK),
						'detail' : "Quick Paid",
						'vendor' : vendor,
						'type' : 'Cash Office'
					};
					Transactions.insert(transaction);
					Books.update(currentBooking._id, {$set : {'paid' : true}});
					var note = {
							created : new Date(),
							type : 'Quick Pay Note',
							note : vendor + " marked the booking ID#"+ currentBooking.refNumber + " as paid",
							bookId : Session.get('currentBooking')
					};

					Notes.insert(note);
				}
			});

		},


});



var calcTotalItems = function(){
	var total = 0;
	$(".calcTotal").filter(function(){
		total += parseInt($(this).text());
	});

	$('#total').text(total);
};

var sendMail = function(book, result, customer){

	var prices = '';
	for (var i = 0; i < book.prices.length; i++) {
		prices += book.prices[i].prices + " - " + book.prices[i].persons + " X " + book.prices[i].perUnit + " = " +  book.prices[i].sum + " ISK <br/>";
	}

	var vehicle = '';
	if(book.vehicle.category != ''){
		vehicle = book.vehicle.category +" - "+ book.vehicle.size+ "m = " + book.vehicle.totalCost + " ISK";
	}

	Meteor.call("generateQRCodeGIF", result);
    Session.set("book", book);

    Session.set("mailing", true);

    Session.set("customer", customer);

	var html = Template.voucher();

	Meteor.call('sendEmailHTML', customer.email, "noreply@seatours.is", "Your Voucher at Seatours!", html);

};

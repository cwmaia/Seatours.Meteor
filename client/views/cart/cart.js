Template.cart.cartBooks = function(){
	return CartItems.find({cartId : getCartIdOperator()});
}

Template.cart.hasItems = function(){
	if(CartItems.find({cartId : getCartIdOperator()}).count() > 0){
		return true;
	}else{
		return false;
	}
}

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
	
}

Template.items.hasVehicle = function(){
	return this.vehicle.category;
}

Template.cart.cbasketBooks = function(){
	return CartItems.find({cartId : getCartId()});
}

Template.cart.customer = function(){
	return isCustomer();
}

Template.cart.totalValue = function(){
	var sum = 0;
	var carts = CartItems.find({cartId : getCartId()}).fetch();
	for (var i = 0; i < carts.length; i++) {
		carts[i]
	};
}

Template.cart.total = function(){
	var carts = CartItems.find({cartId : getCartIdOperator()}).fetch();
	var total = 0;
	for (var i = 0; i < carts.length; i++) {
		total += parseInt(carts[i].totalISK);
	};
	return total;

}


Template.items.dateNoTimeZone = function(date){ 
	return date.toUTCString().slice(5,17);;
}

Template.cart.totalCustomer = function(){
	var carts = CartItems.find({cartId : getCartId()}).fetch();
	var total = 0;
	for (var i = 0; i < carts.length; i++) {
		total += parseInt(carts[i].totalISK);
	};
	return total;
}

Template.items.customerName = function(customerId){
	var customer = Customers.findOne({_id : customerId});
	if(customer)
		return customer.title + '. ' + customer.fullName;
	return "";	 
}

Template.cart.disableCheckout = function(){
	if(!isCustomer() && CartItems.find().count() > 0){
		return false;
	}else if(isCustomer() && CartItems.find().count() > 0){
		return false;
	}else{
		return true;
	}
}

Template.cart.events({
	'click .checkout' : function(event){
		event.preventDefault();
		if(isCustomerNotLogged()){
			//Show Login Screen	
			cleanExternView();
			Session.set('externalLogin', true);
			$("#loginArea").hide();
			Template.externView.rendered();
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
				note = Notes.findOne({bookId: books[i]._id});
				if(note)
					Notes.update(note._id, {$set : {bookId: bookId}});
		};

		throwSuccess(books.length+' Bookings Created!');
		Session.set("createdBooks", createdBooks);
		Meteor.Router.to("/finishBooking");
		}

		
	}
})

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
	}
})

var calcTotalItems = function(){
	var total = 0;
	$(".calcTotal").filter(function(){
		total += parseInt($(this).text());
	})

	$('#total').text(total);
}

var sendMail = function(book, result, customer){

	var prices = '';
	for (var i = 0; i < book.prices.length; i++) {
		prices += book.prices[i].prices + " - " + book.prices[i].persons + " X " + book.prices[i].perUnit + " = " +  book.prices[i].sum + " ISK <br/>";
	};

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

}

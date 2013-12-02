Template.cart.cartBooks = function(){
	return CartItems.find();
}

Template.cart.hasItems = function(){
	if(CartItems.find().count() > 0){
		return true;
	}
	return false;
}

Template.cart.totalValue = function(){
	var sum = 0;
	var carts = CartItems.find().fetch();
	for (var i = 0; i < carts.length; i++) {
		carts[i]
	};
}

Template.cart.total = function(){
	var carts = CartItems.find().fetch();
	var total = 0;
	for (var i = 0; i < carts.length; i++) {
		total += parseInt(carts[i].totalISK);
	};
	return total;

}

Template.items.customerName = function(customerId){
	var customer = Customers.findOne({_id : customerId});
	return customer.title + '. ' + customer.fullName; 
}

Template.cart.events({
	'click .checkout' : function(){
		var books = CartItems.find().fetch();
		for (var i = 0; i < books.length; i++) {
			var customer = Customers.findOne({_id : books[i].customerId});
			sendMail(books[i],books[i]._id, customer);
			CartItems.remove({_id : books[i]._id});
			bookId = Books.insert(books[i]);

			//UpdateNote
			note = Notes.findOne({bookId: books[i]._id});
			if(note)
				Notes.update(note._id, {$set : {bookId: bookId}});
		};

		throwSuccess(books.length+' Bookings Created!');
	}
})

Template.items.events({
	'change .number' : function(event){
		var totalParcial = event.currentTarget.value * this.totalISK;
		$('#'+this._id).text(totalParcial);
		calcTotalItems();
	},
	'click .remove' : function(event){
		var link = event.target;
		CartItems.remove(link.rel);

		//Remove all notes
		var notes = Notes.find({bookId: link.rel}).fetch();
		for (var i = 0; i < notes.length; i++) {
			Notes.remove(notes[i]._id);
		};

		throwSuccess('Item Removed');
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

	var qrcodeTag = "";
	 Meteor.call("generateQRCodeGIF", result);

    Session.set("qrCode", qrcodeTag);
    Session.set("book", book);
    Session.set("customer", customer);

	var html = Template.voucher();
	Meteor.call('sendEmailHTML', customer.email, "noreply@seatours.is", "Your Voucher at Seatours!", html);

}

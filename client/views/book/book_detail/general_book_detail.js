Template.bookCustomerDetailResume.customer = function(){
	var currentBook = Books.findOne({_id: Session.get('bookId')});
	return Customers.findOne({_id: currentBook.customerId});
}

Template.bookCustomerEmailResume.customer = function(){
	var currentBook = Books.findOne({_id: Session.get('bookId')});
	return Customers.findOne({_id: currentBook.customerId});
}

Template.bookTransactionsResume.book = function(){
	return Books.findOne({_id: Session.get('bookId')});
}



Template.bookDetailResume.events({
	'click .editBook' : function(event){
		Session.set('isEditing', true);
		Session.set("firstTime", true);
		Session.set("firstTimePrice", true);
		book = Books.findOne({_id: Session.get("bookId")});
		product = Products.findOne({_id: book.product._id});
		Session.set("customerId", book.customerId);
		Session.set("productId", product._id);
		Session.set("bookingDate", book.dateOfBooking);
		Session.set('tripId',Trips.findOne({from : book.trip.from, to : book.trip.to})._id);
		Meteor.Router.to('/bookEdit');
	}
})




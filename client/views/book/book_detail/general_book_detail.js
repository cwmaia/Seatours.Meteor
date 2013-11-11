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




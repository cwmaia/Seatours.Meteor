var Book = {};

Template.voucher.book = function(){
	Book = Books.findOne({_id: Session.get('bookId')});
	return Book;
}

Template.voucher.customer = function(){
	return Customers.findOne({_id: Book.customerId});
}

Template.voucher.hasVehicles = function(){
	if(Book.vehicle.category != ''){
		return true;
	}else{
		return false;
	}
}

Template.voucher.helpers({
	'click .print' : function() {
		
	}
})
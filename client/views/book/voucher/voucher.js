var Book = {};

Template.voucher.book = function(){
	Book = Books.findOne({_id: Session.get('bookId')});
	return Book;
}

Template.voucher.hasVehicles = function(){
	if(Book.vehicle.category != ''){
		return true;
	}else{
		return false;
	}
}


Template.voucher.book = function(){
	return Books.findOne({_id: Session.get('bookId')});
}


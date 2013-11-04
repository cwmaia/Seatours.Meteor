Template.voucher.rendered = function(){
	var sended = Books.findOne({_id: Session.get('bookId')}).voucherSended;
	if(!sended){
		
	}
}

Template.voucher.book = function(){
	return Books.findOne({_id: Session.get('bookId')});
}


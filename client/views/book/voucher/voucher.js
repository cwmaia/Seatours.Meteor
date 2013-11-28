var Book = {};

Template.voucher.book = function(){

	Book = Meteor.call('getBookById', Session.get('bookId'), function(error, result){
    	if(error){
        	console.log(error.reason);
       	}
       	else{
       		Session.set("_selectedBooking", result);
       		return result;
       	}
       });
    Book = Session.get("_selectedBooking");
	return Book;
}

Template.voucher.date = function(){
	Book = Meteor.call('getBookById', Session.get('bookId'), function(error, result){
    	if(error){
        	console.log(error.reason);
       	}
       	else{
       		Session.set("_selectedBooking", result);
       		return result;
       	}
       });
    Book = Session.get("_selectedBooking");
	return Book.dateOfBooking.toDateString();
}

Template.voucher.customer = function(){
	var customer;
	Book = Meteor.call('getBookById', Session.get('bookId'), function(error, result){
    	if(error){
        	console.log(error.reason);
       	}
       	else{
       		Session.set("_selectedBooking", result);
       		Book = Session.get("_selectedBooking");
       		customer = Meteor.call('getCustomerById', Book.customerId,function(error, resultCustomer){
    			if(error){
		        	console.log(error.reason);
		       	}
		       	else{
		       		Session.set("_selectedCustomer", resultCustomer);
		       		customer = Session.get("_selectedCustomer");
		       	}
		       });
       	}
       });
	customer = Session.get("_selectedCustomer");
	return customer;
}

Template.voucher.hasVehicles = function(){
	if(Book.vehicle.category != ''){
		return true;
	}else{
		return false;
	}
}

Template.voucher.qrCode = function(){
	Session.get('bookId') ? {
 	var qrcodeTag = Meteor.call("generateQRCode", Session.get('bookId'), function(error, result){
		if(error){
        	console.log(error.reason);
       	}
       	else{
       		Session.set('_qrcodeTag', result);
       		return result;
       	}
    });
    qrcodeTag = Session.get('_qrcodeTag');
	return qrcodeTag;
	}
	:
	return "testando123;";

}

Template.voucher.helpers({
	'click .print' : function() {
		
	}
})
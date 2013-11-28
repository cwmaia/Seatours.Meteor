var Book = {};

Template.voucher.book = function(){
  if(Session.get('book')){
    return Session.get('book');
  }else{
    Book = Books.findOne({_id: Session.get('bookId')});
    return Book;
  }
}

Template.voucher.date = function(){
  if(Session.get('book')){
    Book = Session.get('book');
    return Book.dateOfBooking.toDateString();
  }else{
    Book = Books.findOne({_id: Session.get('bookId')});
    return Book.dateOfBooking.toDateString();
  }
}

Template.voucher.customer = function(){
  if(Session.get('customer')){
    return Session.get('customer');
  }else{
    var customer;
    Book = Books.findOne({_id: Session.get('bookId')});
    customer = Customers.findOne({_id: Book.customerId});
    return customer;  
  }
	
}

Template.voucher.hasVehicles = function(){
	if(Book.vehicle.category != ''){
		return true;
	}else{
		return false;
	}
}

Template.voucher.qrCode = function(){
	if(Session.get('bookId')){
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
  }else{
    Book = Session.get('book');
    var qrcodeTag = Meteor.call("get", Book._id, function(error, result){
    if(error){
          console.log(error.reason);
        }
        else{
          Session.set('_qrcodeTag', result);
          return result;
        }
    });
    qrcodeTag = Session.get('_qrcodeTag');
    console.log(qrcodeTag);
    return "jarbas";
  }
}

Template.voucher.helpers({
	'click .print' : function() {
		
	}
})
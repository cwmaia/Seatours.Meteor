var Book = {};

Template.voucher.book = function(){
    Book = Books.findOne({_id: Session.get('bookId')});
    return Book;
}

Template.voucher.getRefNumber = function(){
    Book = Books.findOne({_id: Session.get('bookId')});
    return Book.refNumber;
}

Template.voucher.date = function(){
    Book = Books.findOne({_id: Session.get('bookId')});
    return Book.dateOfBooking.toDateString();
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

var showAlertDiv = function(){
  var bookTransactions = Transactions.find({bookId : Session.get('bookId')}).fetch();
  var book = Books.findOne({_id : Session.get('bookId')});
  var totalISK = book.totalISK;
  for (var i = bookTransactions.length - 1; i >= 0; i--) {
    if(bookTransactions[i].type == 'Refund'){
      totalISK = totalISK + bookTransactions[i].amount;
    }else{
      totalISK = totalISK - bookTransactions[i].amount;
    }
  };

  if(totalISK > 0){
    return true;
  }else{
    return false;
  }
}

Template.voucher.calcTotal = function(totalISK){
  var bookTransactions = Transactions.find({bookId : Session.get('bookId')}).fetch();
  for (var i = bookTransactions.length - 1; i >= 0; i--) {
    if(bookTransactions[i].type == 'Refund'){
      totalISK = totalISK + bookTransactions[i].amount;
    }else{
      totalISK = totalISK - bookTransactions[i].amount;
    }
  };

  return totalISK;

}


Template.voucher.hasVehicles = function(){
	if(Book.vehicle.category != ''){
		return true;
	}else{
		return false;
	}
}

Template.voucher.transactions = function(){
  return Transactions.find({bookId : Session.get('bookId')});
}

Template.voucher.format = function(date){
  var _date = new Date(""+date);
  return _date.toLocaleDateString();
}

Template.voucher.qrCode = function(){
	if(Session.get('mailing')){
    Book = Session.get('book');
    var server = 'http://localhost:3000/'
    var qrcodePath = 'images/qrcodes/'  + Book._id + '.gif';

    Session.set("mailing", false);
    return server+qrcodePath;
  }else{
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
}

Template.voucher.rendered = function(){
  $(".calcISK").maskMoney({thousands:'.', allowNegative:'true', precision:'0'});
  $(".calcISK").maskMoney('mask');
  if(!showAlertDiv()){
    $('#alertNotPaid').hide();
  }
}

Template.voucher.helpers({
	'click .print' : function() {
		
	}
})
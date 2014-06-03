var book = {};

Template.voucher.book = function(){
  if(Books.findOne({_id : Session.get('bookId')})){
    book = Books.findOne({_id : Session.get('bookId')});
  }else{
    book = Session.get("book");
  }
  return book;
};

Template.voucher.formatDate = function(date){
  return date.toLocaleDateString();
};

Template.voucher.getRefNumber = function(){
  if(Books.findOne({_id : Session.get('bookId')})){
    book = Books.findOne({_id : Session.get('bookId')});
  }else{
    book = Session.get("book");
  }
  return book.refNumber;
};

Template.voucher.date = function(){
  if(Books.findOne({_id : Session.get('bookId')})){
    book = Books.findOne({_id : Session.get('bookId')});
  }else{
    book = Session.get("book");
  }
  return book.dateOfBooking.toDateString();
};

Template.voucher.customer = function(){
  if(Session.get('customer')){
    return Session.get('customer');
  }else{
    var customer;
    if(Books.findOne({_id : Session.get('bookId')})){
      book = Books.findOne({_id : Session.get('bookId')});
    }else{
      book = Session.get("book");
    }
    customer = Customers.findOne({_id: book.customerId});
    return customer;
  }

}

Template.voucher.calcTotal = function(totalISK){
  if(Books.findOne({_id : Session.get('bookId')})){
    bookTransactions = Transactions.find({bookId : Session.get('bookId')}).fetch();
    book = Books.findOne({_id : Session.get('bookId')});
  }else{
    var book = Session.get("book");
    var bookTransactions = Transactions.find({bookId : book._id}).fetch();
  }
  for (var i = bookTransactions.length - 1; i >= 0; i--) {
    if(bookTransactions[i].type == 'Refund'){
      totalISK = totalISK + bookTransactions[i].amount;
    }else{
      totalISK = totalISK - bookTransactions[i].amount;
    }
  };

  return totalISK;

}

Template.voucher.paidFullDiv = function(){
  if(book.paid){
    return "";
  }
  var html = "";
  html += "<div id='alertNotPaid' class='alert alert-danger' style='font-size: 13px;";
  html += "margin-bottom: 20px;";
  html += "text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);";
  html += "background-color: #fcf8e3;";
  html += "border: 1px solid #fbeed5;";
  html += "margin-left: 2%;";
  html += "margin-right: 2%;";
  html += "text-align: center;'>";
  html += "<b style='color: #FF2400;'>This voucher has not yet been paid full, please complete the payment at our office.</b>";
  html += "</div>";
  return html;
};

Template.voucher.stopAtFlatey = function(){

  note = Notes.findOne({bookId : book._id, type: "Stop at flatey"});
  var html = "";
  if(note){
    html += "<div id='alertNotPaid' class='alert alert-warning' style='font-size: 13px;";
    html += "margin-bottom: 20px;";
    html += "text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);";
    html += "background-color: #fcf8e3;";
    html += "border: 1px solid #fbeed5;";
    html += "margin-left: 2%;";
    html += "margin-right: 2%;";
    html += "text-align: center;'>";
    html += "<b>This customer will make a stop at Flatey.</b>";
    html += "</div>";
  }

  return html;
};


Template.voucher.hasVehicles = function(){
	if(book.vehicle.category != ''){
		return true;
	}else{
		return false;
	}
};

Template.voucher.transactions = function(){
  if(Books.findOne({_id : Session.get('bookId')})){
    bookTransactions = Transactions.find({bookId : Session.get('bookId')}).fetch();
    book = Books.findOne({_id : Session.get('bookId')});
  }else{
    book = Session.get("book");
    bookTransactions = Transactions.find({bookId : book._id}).fetch();
  }
  return bookTransactions;
}

Template.voucher.format = function(date){
  var _date = new Date(""+date);
  return _date.toUTCString().slice(5,17);
}

Template.voucher.qrCode = function(){
	if(Session.get('mailing')){
    book = Session.get('book');
    var server = 'http://localhost:3000/'
    var qrcodePath = 'images/qrcodes/'  + book._id + '.gif';

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
  $(".formattedAsMoney").maskMoney({thousands:'.', allowNegative:'true', precision:'0'});
  $(".formattedAsMoney").maskMoney('mask');
}

Template.voucher.helpers({
	'click .print' : function() {

	}
})

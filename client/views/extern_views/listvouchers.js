Template.listvouchers.bookings = function(){
	return Books.find({orderId : Session.get("orderId")});
}

var returnBooks = function(result){
	return result;
}

Template.listvouchers.date = function(date){
	return date.toLocaleDateString(("en-GB"));
}

var send = true;

Template.listvouchers.events({
	"click .myVoucher" : function(event){
		var a = event.currentTarget;
		event.preventDefault();
		cleanExternView();
		Session.set("bookId", a.rel);
		Session.set("myVoucher", true);
		Template.externView.rendered();
	}
})

var initSendMails = function(flag){
	console.log(flag);
	if(flag){
		Meteor.call("getAllBooksByOrder", Session.get("orderId"), function(err, result){
			if(err){
				console.log(err);
			}else{
				getCustomer(result);
			}
		})
		
	}
}

Template.listvouchers.rendered = function(){
	initSendMails(send);
	send = false;
	
}

var getCustomer = function(books){
	Meteor.call("getCustomerById", books[0].customerId, function(err, result){
		if(err){
			console.log(err);
		}else{
			sendMails(books, result);
		}
	})
}

var sendMails = function(fetchedBooks, customer){
	try{
		for (var i = fetchedBooks.length - 1; i >= 0; i--) {
			sendMail(fetchedBooks[i], fetchedBooks[i]._id, customer)
		};
		bootbox.alert("A email was sent to you with the voucher, any questions just call us!");
	}catch(err){
		console.log(err);
		bootbox.alert("Sorry looks like our server is busy right now, please call us to sent your voucher!");
	}
}


var sendMail = function(book, result, customer){
	var prices = '';
	for (var i = 0; i < book.prices.length; i++) {
		prices += book.prices[i].prices + " - " + book.prices[i].persons + " X " + book.prices[i].perUnit + " = " +  book.prices[i].sum + " ISK <br/>";
	};

	var vehicle = '';
	if(book.vehicle.category != ''){
		vehicle = book.vehicle.category +" - "+ book.vehicle.size+ "m = " + book.vehicle.totalCost + " ISK";
	}

	//Meteor.call("generateQRCodeGIF", result);
    Session.set("book", book);

    Session.set("mailing", true);
    
    Session.set("customer", customer);
    
	var html = Template.voucher();

	Meteor.call('sendEmailHTML', customer.email, "noreply@seatours.is", "Your Voucher at Seatours!", html);
	
}
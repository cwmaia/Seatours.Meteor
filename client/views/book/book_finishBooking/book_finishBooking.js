Template.finishBooking.rendered = function(){
	$("#transactionDialog").hide();
	$("#discountDialog").hide();
}

Template.finishBooking.bookings = function(){
	return Session.get("createdBooks");
}

Template.finishBooking.fullName = function(customerId){
	return Customers.findOne({_id : customerId}).fullName;
}

Template.finishBooking.vendor = function(){
	return Meteor.user().profile.name;
}


Template.finishBooking.events({
	'click .saveDiscount':function(event){
		event.preventDefault();
		var percentage = $('#discount').val();
		var vendor = Meteor.user().profile.name;

		var book = Books.findOne({_id : Session.get('currentBooking')});
		var totalISKAfterDiscount = parseInt(book.totalISK * (1-(percentage/100)));

		Books.update(book._id, {$set : {"totalISK" : totalISKAfterDiscount}});

		var note = {
			created : new Date(),
			type : 'Discount Note',
			note : vendor + " gave the customer "+ percentage + "% of discount",
			bookId : Session.get('currentBooking')
		}

		Notes.insert(note);
		
		Template.finishBooking.rendered();

	},
	'click .giveDiscount':function(event){
		event.preventDefault();
		var a = event.currentTarget;
		var bookId = a.rel;
		Session.set("currentBooking", bookId);
		$("#discountDialog").show();
	},

	'click .payBooking':function(event){
		event.preventDefault();
		var a = event.currentTarget;
		var bookId = a.rel;
		Session.set("currentBooking", bookId);
		var totalISK = Books.findOne({"_id" : Session.get('currentBooking')}).totalISK;
		var thisBookingTransactions = Transactions.find({'bookId' : Session.get('currentBooking')}).fetch();
		var totalTransactions = 0;
		for (var i = thisBookingTransactions.length - 1; i >= 0; i--) {
			totalTransactions = totalTransactions + thisBookingTransactions[i].amount;
		};
		var totalToPay = totalISK - totalTransactions;
		$("#toPay").text(totalToPay);
		$("#transactionDialog").show();
	},
	'click .cancel, click .close' : function(event){
		event.preventDefault();
		$("#transactionDialog").hide();
		$("#discountDialog").hide();
	},
	'click .saveTransaction' : function(event){
		event.preventDefault();
		//calc total amount with discount
		var amount = $('#amount').val();
		var vendor = Meteor.user().profile.name;
		var type = $('#type').val();
		var detail = $('#detail').val();

		if(!amount){
			throwError('Please Add the Amount of Transaction');
			return;
		}

		if(!vendor){
			throwError('Please Inform the Vendor');
			return;
		}

		if(!date){
			throwError('Please Add the date of Transaction');
			return;
		}

		if(!type){
			throwError('Please Add the type of Transaction');
			return;
		}

		var transaction = {
			'bookId' : Session.get('currentBooking'),
			'date' : new Date(date),
			'status' : 'Processing',
			'amount' : amount,
			'detail' : detail,
			'vendor' : vendor,
			'type' : type
		}

		Transactions.insert(transaction);
		$("#transactionDialog").hide();
		var bookId = Session.get('currentBooking');
		var totalISK = Books.findOne({"_id" : Session.get('currentBooking')}).totalISK;
		var thisBookingTransactions = Transactions.find({'bookId' : bookId}).fetch();
		var totalTransactions = 0;
		for (var i = thisBookingTransactions.length - 1; i >= 0; i--) {
			totalTransactions = parseInt(totalTransactions + thisBookingTransactions[i].amount);
		};

		if( totalISK == totalTransactions){
			$("#"+bookId+"_paymentStatus").text("Paid");
			Books.update(bookId, {$set : {paid : true}});
		}else if (totalISK > totalTransactions){
			var pending = totalISK - totalTransactions;
			$("#"+bookId+"_paymentStatus").text(pending + "ISK Pending");
		}else{
			var refund = totalTransactions - totalISK;
			$("#"+bookId+"_paymentStatus").text(refund + "ISK to be refund");
		}
	}

});


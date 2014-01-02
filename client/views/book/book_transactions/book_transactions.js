Template.bookTransactionsResume.transactions = function(){
	return Transactions.find({bookId : Session.get('bookId')});
}

Template.bookTransactionsResume.rendered = function(){
	$("#discountDialog").hide();
	$("#transactionDialog").hide();
	$("#extraFeeDialog").hide();
	$('.datepicker').datepicker();
}

Template.bookTransactionsResume.dateString = function(data){
	return data.toDateString();
}

Template.bookTransactionsResume.vendors = function(){
	var vendorsGroup = Groups.findOne({name : 'Vendors'});
	return Meteor.users.find({'profile.groupID' : vendorsGroup._id});
}

Template.bookTransactionsResume.events({
	'click .saveDiscount':function(event){
		event.preventDefault();
		var percentage = $('#discount').val();
		var vendor = $('#vendor').val();

		var book = Books.findOne({_id : Session.get('bookId')});
		var totalISKAfterDiscount = parseInt(book.totalISK * (1-(percentage/100)));

		Books.update(book._id, {$set : {"totalISK" : totalISKAfterDiscount}});

		var note = {
			created : new Date(),
			type : 'Discount Note',
			note : vendor + " gave the customer "+ percentage + "% of discount",
			bookId : Session.get('bookId')
		}

		Notes.insert(note);

		$("#discountDialog").hide();

	},
	'click #giveDiscount':function(){
		$("#discountDialog").show();
	},

	'click #addTransaction' : function(){
		$("#transactionDialog").show();
	},
	'click #addExtraFee' : function(){
		$("#extraFeeDialog").show();
	},
	'click .cancel, click .close' : function(){
		$("#transactionDialog").hide();
		$("#discountDialog").hide();
		$("#extraFeeDialog").hide();
	},
	'click .saveExtraFee':function(event){
		event.preventDefault();
		//calc total amount with discount
		var amount = $('#extraFee').val();
		amount = 0 - amount;
		var vendor = $('#vendorFee').val();
		var type = $('#typeFee').val();

		if(!amount){
			throwError('Please Add the Amount of Transaction');
			return;
		}

		if(!type){
			throwError('Please Add the type of Transaction');
			return;
		}

		var transaction = {
			'bookId' : Session.get('currentBooking'),
			'date' : new Date(date),
			'status' : 'Extra Fee',
			'amount' : amount,
			'detail' : "Extra Charges",
			'vendor' : vendor,
			'type' : type
		}
		Transactions.insert(transaction);
		var bookId = Session.get('currentBooking');
		var totalISK = Books.findOne({"_id" : Session.get('currentBooking')}).totalISK;
		var thisBookingTransactions = Transactions.find({'bookId' : bookId}).fetch();
		var totalTransactions = 0;
		for (var i = thisBookingTransactions.length - 1; i >= 0; i--) {
			totalTransactions = totalTransactions + thisBookingTransactions[i].amount;
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

		$("#extraFeeDialog").hide();
	},
	'click .saveTransaction' : function(){

		//calc total amount with discount
		var date = $('#date').val();
		var amount = $('#amount').val();
		var vendor = $('#vendor').val();
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
			'bookId' : Session.get('bookId'),
			'date' : new Date(date),
			'status' : 'Processing',
			'amount' : amount,
			'detail' : detail,
			'vendor' : vendor,
			'type' : type
		}

		Transactions.insert(transaction);
		$("#transactionDialog").hide();
		
	}
})
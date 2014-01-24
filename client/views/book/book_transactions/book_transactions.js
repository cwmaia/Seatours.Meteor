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

Template.bookTransactionsResume.vendor = function(){
	return Meteor.user().profile.name;
}

Template.bookTransactionsResume.events({
	'click .saveDiscount':function(event){
		event.preventDefault();
		var percentage = $('#discount').val();
		var vendor = Meteor.user().profile.name;
		percentage = parseInt(percentage);

		var book = Books.findOne({_id : Session.get('bookId')});
	
		var amount = parseInt(book.totalISK * (percentage/100));



		var transaction = {
			'bookId' : Session.get('bookId'),
			'date' : new Date(),
			'status' : 'Given',
			'amount' : amount,
			'detail' : percentage+"% as discount",
			'vendor' : vendor,
			'type' : 'Discount'
		}
		Transactions.insert(transaction);

		var note = {
			created : new Date(),
			type : 'Discount Note',
			note : vendor + " gave the customer "+ percentage + "% as discount",
			bookId : Session.get('currentBooking')
		}

		Notes.insert(note);
		$("#discountDialog").hide();
		
		Template.finishBooking.rendered();

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
		amount = parseInt(amount);
		amount = 0 - amount;
		var vendor = $('#vendorFee').val();
		var type = $('#typeFee').val();

		if(!amount){
			throwError('Please Add the Amount for the Transaction');
			return;
		}

		if(!type){
			throwError('Please Add the type of Transaction');
			return;
		}

		var transaction = {
			'bookId' : Session.get('bookId'),
			'date' : new Date(),
			'status' : 'Extra Fee',
			'amount' : amount,
			'detail' : "Extra Charges",
			'vendor' : vendor,
			'type' : type
		}
		Transactions.insert(transaction);
		
		$("#extraFeeDialog").hide();
	},
	'click .saveTransaction' : function(){

		//calc total amount with discount
		var amount = $('#amount').val();
		amount = parseInt(amount);
		var type = $('#type').val();
		var detail = $('#detail').val();

		if(!amount){
			throwError('Please Add the Amount for the Transaction');
			return;
		}

		if(!type){
			throwError('Please Add the type of Transaction');
			return;
		}

		var transaction = {
			'bookId' : Session.get('bookId'),
			'date' : new Date(),
			'status' : 'Processing',
			'amount' : amount,
			'detail' : detail,
			'vendor' : Meteor.user().profile.name,
			'type' : type
		}

		Transactions.insert(transaction);

		//Check if all was paid
		var bookId = Session.get('bookId');
		var totalISK = Books.findOne({"_id" : Session.get('bookId')}).totalISK;
		var thisBookingTransactions = Transactions.find({'bookId' : bookId}).fetch();
		var totalTransactions = 0;
		for (var i = thisBookingTransactions.length - 1; i >= 0; i--) {
			totalTransactions = parseInt(totalTransactions + thisBookingTransactions[i].amount);
		};

		if( totalISK == totalTransactions){
			Books.update(bookId, {$set : {paid : true}});
		}

		
		$("#transactionDialog").hide();
		
	}
})
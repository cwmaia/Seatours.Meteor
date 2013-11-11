Template.bookTransactionsResume.transactions = function(){
	return Transactions.find({bookId : Session.get('bookId')});
}

Template.bookTransactionsResume.rendered = function(){
	$("#transactionDialog").hide();
	$('.datepicker').datepicker();
}

Template.bookTransactionsResume.dateString = function(data){
	return data.toDateString();
}

Template.bookTransactionsResume.events({
	'click #addTransaction' : function(){
		$("#transactionDialog").show();
	},
	'click .cancel, click .close' : function(){
		$("#transactionDialog").hide();
	},
	'click .saveTransaction' : function(){

		//calc total amount with descount
		var date = $('#date').val();
		var amount = $('#amount').val();
		var descount = $('#descount').val();
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

		var amountDescount = amount * (descount/100);
		var totalAmount = amount - amountDescount;

		var transaction = {
			'bookId' : Session.get('bookId'),
			'date' : new Date(date),
			'status' : 'Processing',
			'amount' : totalAmount,
			'detail' : detail,
			'vendor' : vendor,
			'type' : type
		}

		Transactions.insert(transaction);
		$("#transactionDialog").hide();
		
	}
})
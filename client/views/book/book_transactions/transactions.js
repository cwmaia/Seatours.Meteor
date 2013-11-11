Template.bookTransactionsResume.transactions = function(){
	return Transactions.find({bookId : Session.get('bookId')});
}

Template.bookTransactionsResume.rendered = function(){
	$("#transactionDialog").hide();
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
		var amount = $('#amount').val();
		var descount = $('#descount').val();

		var amountDescount = amount * (descount/100);
		var totalAmount = amount - amountDescount;
		console.log(totalAmount);

	}
})
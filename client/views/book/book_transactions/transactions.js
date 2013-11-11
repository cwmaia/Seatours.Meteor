Template.bookTransactionsResume.transactions = function(){
	return Transactions.find({bookId : Session.get('bookId')});
}
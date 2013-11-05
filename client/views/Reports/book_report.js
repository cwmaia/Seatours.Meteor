Template.bookReport.helpers({
	books : function(){
		return Session.get('Books') ? Session.get('Books') : [];
	},
	products : function(){
		return Products.find();
	}
})

Template.bookReport.rendered = function(){
	$('.calendar').datepicker();
}

Template.bookReport.events({
	'click .filter' : function(event){

		var listOfBooks;

		var product = $('#product').val(); 
		var from = $('#from').val();
		var to = $('#to').val();
		var bookStatus = $('#bookStatus').val();
		var paymentStatus = $('#paymentStatus').val();

		if(!from || !to){
			throwError('Dates are Needed!');
			return;
		}

		var dateFrom = new Date(from);
		var dateTo = new Date(to);
		
		var query = {dateOfBooking: {$gte: dateFrom, $lt: dateTo}};

		if(product) 
			query['product._id'] = product;

		if(paymentStatus)
			query['paid'] = (paymentStatus === '0') ? false : true;

		if(bookStatus)
			query['bookStatus'] = bookStatus;

		listOfBooks = Books.find(query).fetch();

		Session.set('Books', listOfBooks);
	}
})
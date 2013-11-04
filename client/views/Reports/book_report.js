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

		if(!from || !to){
			throwError('Dates are Needed!');
			return;
		}

		var dateFrom = new Date(from);
		var dateTo = new Date(to);
	

		if(product){
			listOfBooks = Books.find({"product._id": product, dateOfBooking: {$gte: dateFrom, $lt: dateTo}}).fetch();
		}else{
			listOfBooks = Books.find({dateOfBooking: {$gte: dateFrom, $lt: dateTo}}).fetch();
		}

		Session.set('Books', listOfBooks);
	}
})
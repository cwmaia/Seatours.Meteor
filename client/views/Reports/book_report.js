Template.bookReport.helpers({
	books : function(){
		return Session.get('Books') ? Session.get('Books') : [];
	},

	products : function(){
		return Products.find();
	}
})

Template.financial.helpers({
	trips : function(){
		return Session.get('Trips') ? Session.get('Trips') : [];
	},

	total : function(tripId, productId){
		var total = 0;
		var from = Session.get('filterFromData');
		var to = Session.get('filterToData');


		books =  Books.find({
			dateOfBooking 	: {$gte: from, $lt: to},
			'product._id' 	: productId,
			'trip._id' 	: tripId
		}).fetch();

		for (var i = 0; i < books.length; i++) {
			total += parseInt(books[i].totalISK);
		};

		return total;
	}
})


Template.bookReport.rendered = function(){
	$('.calendar').datepicker();
	$('#filterResult').dataTable();
}

Template.bookReport.fullname = function(id){
	return Customers.findOne({_id: id}).fullName;
}

Template.bookReport.birth = function(id){
	return Customers.findOne({_id: id}).birthDate;
}

Template.bookReport.email = function(id){
	return Customers.findOne({_id: id}).email;
}

Template.bookReport.telephone = function(id){
	return Customers.findOne({_id: id}).telephone;
}

Template.bookReport.adress = function(id){
	customer = Customers.findOne({_id: id})
	var adress = customer.adress + ' - ' + customer.city + ' - ' + customer.state + ' - ' + customer.postcode + ' - ' + customer.country;
	return adress;
}

Template.bookReport.events({
	'click .filter' : function(event){

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
		with(dateTo){
			setDate(getDate() + 1);
		}

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

Template.financial.events({
	'click .filter' : function(event){
		var product = $('#product').val(); 
		var from = $('#from').val();
		var to = $('#to').val();

		if(!from || !to){
			throwError('Dates are Needed!');
			return;
		}

		var dateFrom = new Date(from);
		var dateTo = new Date(to);
		with(dateTo){
			setDate(getDate() + 1);
		}
		
		if(product) 
       		query['product._id'] = product;
 		
 
	    trips = Trips.find(query).fetch();

	    Session.set('Trips', trips);
	    Session.set('filterFromData', from);
	    Session.set('filterToData', to);

	}
})
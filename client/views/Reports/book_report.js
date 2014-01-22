Template.bookingsReport.helpers({
	books : function(){
		return Session.get('Books') ? Session.get('Books') : [];
	},

	products : function(){
		return Products.find();
	}
})

Template.financialReport.helpers({
	products : function(){
		return Products.find();
	},

	seasons : function(){
		if(this.season == 'noSeason')
			return false;
		return true;
	},

	trips : function(){
		console.log('here');
		products = Session.get("productsFinancial")
		if(products){
			var tripsReturn = [];
			for (var i = 0; i < products.length; i++) {
				trips = Trips.find({productId : products[i]._id}).fetch();
				if(trips){
					for (var j = 0; j < trips.length; j++) {
						tripsReturn.push(trips[j]);
					};
				}
			};
			console.log(tripsReturn);
			return tripsReturn;
		}else{
			return null;
		}
	},

	total : function(tripId, productId){
		var total = 0;
		dates = getFinancialDates();


		books =  Books.find({
			dateOfBooking 	: {$gte: dates.from, $lt: dates.to},
			'product._id' 	: productId,
			'trip._id' 	: tripId
		}).fetch();

		for (var i = 0; i < books.length; i++) {
			total += parseInt(books[i].totalISK);
		};

		return total;
	},

	totalPaid : function(tripId, productId){
		var total = 0;
		dates = getFinancialDates();


		books =  Books.find({
			dateOfBooking 	: {$gte: dates.from, $lt: dates.to},
			'product._id' 	: productId,
			'trip._id' 	: tripId
		}).fetch();

		for (var i = 0; i < books.length; i++) {
			transactions = Transactions.find({bookId : books[i]._id}).fetch();
			for (var j = 0; j < transactions.length; j++) {
				total = parseInt(transactions[j].amount);
			};
		};

		return total;
	},

	totalNotPaid : function(tripId, productId){
		var total = 0;
		dates = getFinancialDates();


		books =  Books.find({
			dateOfBooking 	: {$gte: dates.from, $lt: dates.to},
			'product._id' 	: productId,
			'trip._id' 	: tripId
		}).fetch();

		for (var i = 0; i < books.length; i++) {
			transactions = Transactions.find({bookId : books[i]._id}).fetch();
			for (var j = 0; j < transactions.length; j++) {
				totalTransactions += parseInt(transactions[j].amount)
			};
			if(totalTransactions < books[i].totalISK){
				total += books[i].totalISK - totalTransactions;
			}
			totalTransactions = 0;
		};

		return total;
	},

	totalNotPaid : function(tripId, productId){
		var total = 0;
		var totalTransactions = 0;
		dates = getFinancialDates();


		books =  Books.find({
			dateOfBooking 	: {$gte: dates.from, $lt: dates.to},
			'product._id' 	: productId,
			'trip._id' 	: tripId
		}).fetch();

		for (var i = 0; i < books.length; i++) {
			transactions = Transactions.find({bookId : books[i]._id}).fetch();
			for (var j = 0; j < transactions.length; j++) {
				totalTransactions += parseInt(transactions[j].amount)
			};
			if(totalTransactions < books[i].totalISK){
				total += books[i].totalISK - totalTransactions;
			}
			totalTransactions = 0;
		};

		return total;
	},

	creditcard : function(tripId, productId){
		var total = 0;
		dates = getFinancialDates();


		books =  Books.find({
			dateOfBooking 	: {$gte: dates.from, $lt: dates.to},
			'product._id' 	: productId,
			'trip._id' 	: tripId
		}).fetch();

		for (var i = 0; i < books.length; i++) {
			transactions = Transactions.find({bookId : books[i]._id}).fetch();
			for (var j = 0; j < transactions.length; j++) {
				if(transactions[j].type == 'Credit Card'){
					total = parseInt(transactions[j].amount)
				}
			};
		};

		return total;
	},

	office : function(tripId, productId){
		var total = 0;
		var from = Session.get('filterFromData');
		var to = Session.get('filterToData');


		books =  Books.find({
			dateOfBooking 	: {$gte: dates.from, $lt: dates.to},
			'product._id' 	: productId,
			'trip._id' 	: tripId
		}).fetch();

			for (var i = 0; i < books.length; i++) {
			transactions = Transactions.find({bookId : books[i]._id}).fetch();
			for (var j = 0; j < transactions.length; j++) {
				if(transactions[j].type == 'Cash Office'){
					total = parseInt(transactions[j].amount)
				}
			};
		};

		return total;
	}

})

Template.bookReport.rendered = function(){
	$('.calendar').datepicker();
	$('#filterResultB').dataTable();
	$('#filterResultF').dataTable();
}

Template.bookingsReport.fullname = function(id){
	return Customers.findOne({_id: id}).fullName;
}

Template.bookingsReport.birth = function(id){
	return Customers.findOne({_id: id}).birthDate;
}

Template.bookingsReport.email = function(id){
	return Customers.findOne({_id: id}).email;
}

Template.bookingsReport.telephone = function(id){
	return Customers.findOne({_id: id}).telephone;
}

Template.bookingsReport.adress = function(id){
	customer = Customers.findOne({_id: id})
	var adress = customer.adress + ' - ' + customer.city + ' - ' + customer.state + ' - ' + customer.postcode + ' - ' + customer.country;
	return adress;
}

Template.bookingsReport.events({
	'click .quickPay' : function(event){
		if(confirm('Are you sure? Clicking this will make the Booking Paid')){
			event.preventDefault();
			var a = event.currentTarget;
			var bookId = a.rel;
			var currentBooking = Books.findOne({'_id' : bookId});
			var vendor = Meteor.user().profile.name;
			var transaction = {
					'bookId' : currentBooking._id,
					'date' : new Date(),
					'status' : 'Given',
					'amount' : currentBooking.totalISK,
					'detail' : "Quick Paid",
					'vendor' : vendor,
					'type' : 'Office Cash'
				}
			Transactions.insert(transaction);
			Books.update(currentBooking._id, {$set : {'paid' : true}});
			var note = {
					created : new Date(),
					type : 'Quick Pay Note',
					note : vendor + " marked the booking ID#"+ currentBooking.refNumber + " as paid",
					bookId : Session.get('currentBooking')
			}

			Notes.insert(note);
		}
	},

	'click .filterB' : function(event){

		var product = $('#productB').val(); 
		var from = $('#fromB').val();
		var to = $('#toB').val();
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

Template.financialReport.events({
	'click .filterF' : function(event){
		var product = $('#productF').val(); 
		var from = $('#fromF').val();
		var to = $('#toF').val();

		console.log(from);
		console.log(to);

		if(!from || !to){
			throwError('Dates are Needed!');
			return;
		}

		var dateFrom = new Date(from);
		var dateTo = new Date(to);
		with(dateTo){
			setDate(getDate() + 1);
		}
		products = [];

		if(product) 
       		products = Products.find({_id: product}).fetch();
       	else
       		products = Products.find().fetch();

	    Session.set('productsFinancial', products);
	    Session.set('filterFromData', from);
	    Session.set('filterToData', to);

	}
})

var getFinancialDates = function(){
	var fromSession = Session.get('filterFromData');
		var toSession = Session.get('filterToData');

		var from = new Date(fromSession);
		var to = new Date(toSession);

		with(from){
			setHours(0);
			setMinutes(0);
			setSeconds(0);
			setMilliseconds(0);
		}

		with(to){
			setHours(0);
			setMinutes(0);
			setSeconds(0);
			setMilliseconds(0);
		}

		var dates = {
			from : from,
			to : to
		}

		return dates;
}
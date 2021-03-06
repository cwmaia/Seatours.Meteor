Template.bookingsReport.helpers({
	books : function(){
		return Session.get('Books') ? Session.get('Books') : [];
	},

	products : function(){
		return Products.find();
	},

	formated : function(dateTime){
		return new Date(dateTime).toLocaleDateString();
	}
});

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
		products = Session.get("productsFinancial");
		if(products){
			var tripsReturn = [];
			for (var i = 0; i < products.length; i++) {
				trips = Trips.find({productId : products[i]._id}).fetch();
				if(trips){
					for (var j = 0; j < trips.length; j++) {
						tripsReturn.push(trips[j]);
					}
				}
			}
			return tripsReturn;
		}else{
			return null;
		}
	},

	total : function(tripId, productId){
		var total = 0;
		var dates = getFinancialDates();


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
		var dates = getFinancialDates();


		books =  Books.find({
			dateOfBooking 	: {$gte: dates.from, $lt: dates.to},
			'product._id' 	: productId,
			'trip._id' 	: tripId
		}).fetch();

		for (var i = 0; i < books.length; i++) {
			transactions = Transactions.find({bookId : books[i]._id}).fetch();
			for (var j = 0; j < transactions.length; j++) {
				if(transactions[j].type == "Credit Card" || transactions[j].type == "Cash Office")
					total += parseInt(transactions[j].amount);
			};
		};

		return total;
	},

	totalNotPaid : function(tripId, productId){
		var total = 0;
		var totalTransactions = 0;
		var dates = getFinancialDates();


		books =  Books.find({
			dateOfBooking 	: {$gte: dates.from, $lt: dates.to},
			'product._id' 	: productId,
			'trip._id' 	: tripId
		}).fetch();

		for (var i = 0; i < books.length; i++) {
			transactions = Transactions.find({bookId : books[i]._id}).fetch();
			for (var j = 0; j < transactions.length; j++) {
				if(transactions[j].type == "Credit Card" || transactions[j].type == "Cash Office")
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
		var dates = getFinancialDates();


		books =  Books.find({
			dateOfBooking 	: {$gte: dates.from, $lt: dates.to},
			'product._id' 	: productId,
			'trip._id' 	: tripId
		}).fetch();

		for (var i = 0; i < books.length; i++) {
			transactions = Transactions.find({bookId : books[i]._id}).fetch();
			for (var j = 0; j < transactions.length; j++) {
				if(transactions[j].type == 'Credit Card'){
					total += parseInt(transactions[j].amount)
				}
			};
		};

		return total;
	},

	refund : function(tripId, productId){
		var total = 0;
		var dates = getFinancialDates();


		books =  Books.find({
			dateOfBooking 	: {$gte: dates.from, $lt: dates.to},
			'product._id' 	: productId,
			'trip._id' 	: tripId
		}).fetch();

		for (var i = 0; i < books.length; i++) {
			transactions = Transactions.find({bookId : books[i]._id}).fetch();
			for (var j = 0; j < transactions.length; j++) {
				if(transactions[j].type == 'Refund'){
					total += parseInt(transactions[j].amount)
				}
			};
		};

		return total;
	},

	office : function(tripId, productId){
		var total = 0;
		var dates = getFinancialDates();


		books =  Books.find({
			dateOfBooking 	: {$gte: dates.from, $lt: dates.to},
			'product._id' 	: productId,
			'trip._id' 	: tripId
		}).fetch();

			for (var i = 0; i < books.length; i++) {
			transactions = Transactions.find({bookId : books[i]._id}).fetch();
			for (var j = 0; j < transactions.length; j++) {
				if(transactions[j].type == 'Cash Office'){
					total += parseInt(transactions[j].amount)
				}
			};
		};

		return total;
	}

})

Template.bookReport.rendered = function(){
	$('.calendar').datepicker({
		format : "dd/mm/yyyy"
	});

	$("#filterResultB").dataTable({
		"iDisplayLength": 50,
		"bServerSide": false,
   		"bDestroy": true
	})
	$("#filterResultF").dataTable({
		"iDisplayLength": 50,
		"bServerSide": false,
   		"bDestroy": true
	})

	$(".formattedAsMoney").maskMoney({thousands:'.', allowNegative:'true', precision:'0'});
  	$(".formattedAsMoney").maskMoney('mask');
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
	var adress = customer.address + ' - ' + customer.addressnumber + ' - ' + customer.city;
	return adress;
}

Template.bookingsReport.events({
	'click .filterB' : function(event){

		var product = $('#productB').val();
		var from = $('#fromB').val();
		var to = $('#toB').val();
		var bookStatus = $('#bookStatus').val();
		var paymentStatus = $('#paymentStatus').val();

		var arrayFrom = from.split('/');
		var fromConverted = arrayFrom[1] + "/" +arrayFrom[0] + "/" +arrayFrom[2];
		var arrayTo = to.split('/');
		var toConverted = arrayTo[1] + "/" +arrayTo[0] + "/" +arrayTo[2];

		if(!from || !to){
			throwError('Dates are Needed!');
			return;
		}

		var dateFrom = new Date(fromConverted).getTime();
		var dateTo = new Date(toConverted);
		with(dateTo){
			setDate(getDate() + 1);
		}

		var timeTo = dateTo.getTime();

		var query = {dateOfBooking: {$gte: dateFrom, $lt: timeTo}};

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

		var arrayFrom = from.split('/');
		var fromConverted = arrayFrom[1] + "/" +arrayFrom[0] + "/" +arrayFrom[2];
		var arrayTo = to.split('/');
		var toConverted = arrayTo[1] + "/" +arrayTo[0] + "/" +arrayTo[2];

		if(!from || !to){
			throwError('Dates are Needed!');
			return;
		}

		var dateFrom = new Date(fromConverted).getTime();
		var dateTo = new Date(toConverted);
		with(dateTo){
			setDate(getDate() + 1);
		}
		
		dateTo = dateTo.getTime();


		products = [];

		if(product)
       		products = Products.find({_id: product}).fetch();
       	else
       		products = Products.find().fetch();

	    Session.set('productsFinancial', products);
	    Session.set('filterFromData', fromConverted);
	    Session.set('filterToData', toConverted);

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
			from : from.getTime(),
			to : to.getTime()
		}

		return dates;
}

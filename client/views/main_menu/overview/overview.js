Template.overview.products = function(){
	return Products.find();
}

Template.overview.date = function(){
	var date = new Date(localStorage.getItem('date'));
	return date.toUTCString().slice(5,17);
}

Template.overview.trips = function(productId){
	return Trips.find({productId : productId, season : currentSeason()});
}

Template.overview.isFirst = function(productId){
	if(Products.find().fetch()[0]){
		return Products.find().fetch()[0]._id == productId;
	}else{
		return false;
	}
}

Template.overview.isBookCreated = function(status) {
	return status == 'Booked';
}

Template.overview.bookings = function(productId, tripId){
	var date = new Date(localStorage.getItem('date')),
	currentDate = new Date(localStorage.getItem('date'));

	with(date){
		setDate(getDate() + 1);
	}

	return Books.find({
		dateOfBooking 	: {$gte: currentDate, $lt: date},
		'product._id' 	: productId,
		'trip._id' 	: tripId
	}, { sort : {paid : -1, bookStatus: 1}});
}

Template.overview.fullname = function(id){
	return Customers.findOne({_id: id}).fullName;
}

Template.overview.telephone = function(id){
	return Customers.findOne({_id: id}).telephone;
}

Template.overview.hasVehicle = function(){
	return this.vehicle.category;
}

Template.overview.total = function(tripId, productId){
	var total = 0;
	var date = new Date(localStorage.getItem('date')),
	currentDate = new Date(localStorage.getItem('date'));

	with(date){
		setDate(getDate() + 1);
	}

	books =  Books.find({
		dateOfBooking 	: {$gte: currentDate, $lt: date},
		'product._id' 	: productId,
		'trip._id' 	: tripId
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		total += parseInt(books[i].totalISK);
	};

	return total;
}

Template.overview.totalPaid = function(tripId, productId){
	var total = 0;
	var date = new Date(localStorage.getItem('date')),
	currentDate = new Date(localStorage.getItem('date'));

	with(date){
		setDate(getDate() + 1);
	}

	books =  Books.find({
		dateOfBooking 	: {$gte: currentDate, $lt: date},
		'product._id' 	: productId,
		'trip._id' 	: tripId
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		transactions = Transactions.find({bookId : books[i]._id}).fetch();
		for (var j = 0; j < transactions.length; j++) {
			total += parseInt(transactions[j].amount);
		};
	};

	return total;
}

Template.overview.totalNotPaid = function(tripId, productId){
	var total = 0;
	var totalTransactions = 0;
	var date = new Date(localStorage.getItem('date')),
	currentDate = new Date(localStorage.getItem('date'));

	with(date){
		setDate(getDate() + 1);
	}

	books =  Books.find({
		dateOfBooking 	: {$gte: currentDate, $lt: date},
		'product._id' 	: productId,
		'trip._id' 	: tripId,
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		transactions = Transactions.find({bookId : books[i]._id}).fetch();
		for (var j = 0; j < transactions.length; j++) {
			if(transactions[j].type != "Refound")
				totalTransactions += parseInt(transactions[j].amount)
		};
		if(totalTransactions < books[i].totalISK){
			total += books[i].totalISK - totalTransactions;
		}
		totalTransactions = 0;
	};

	return total;
}

Template.overview.creditcard = function(tripId, productId){
	var total = 0;
	var date = new Date(localStorage.getItem('date')),
	currentDate = new Date(localStorage.getItem('date'));

	with(date){
		setDate(getDate() + 1);
	}

	books =  Books.find({
		dateOfBooking 	: {$gte: currentDate, $lt: date},
		'product._id' 	: productId,
		'trip._id' 	: tripId,
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
}

Template.overview.office = function(tripId, productId){
	var total = 0;
	var date = new Date(localStorage.getItem('date')),
	currentDate = new Date(localStorage.getItem('date'));

	with(date){
		setDate(getDate() + 1);
	}

	books =  Books.find({
		dateOfBooking 	: {$gte: currentDate, $lt: date},
		'product._id' 	: productId,
		'trip._id' 	: tripId,
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

Template.overview.totalPassagers = function(id){
	var persons = 0;
	book = Books.findOne({_id : id});
	for (var i = 0; i < book.prices.length; i++) {
		if(book.prices[i].price != "Operator Fee")
			persons = parseInt(persons + parseInt(book.prices[i].persons));
	};
	return persons;
}

Template.overview.lineColor = function(paid, bookStatus){
	if(paid && bookStatus == "Booked"){
		return 'green';
	}else if(paid && bookStatus == 'Canceled'){
		return 'orange';
	}else{
		return "red";
	}
	
}

Template.overview.rendered = function(){
	$(".formattedAsMoney").maskMoney({thousands:'.', allowNegative:'true', precision:'0'});
	$(".formattedAsMoney").maskMoney('mask');

}


Template.overview.events({
	'click .quickPay' : function(event){
		event.preventDefault();
		var a = event.currentTarget;
		bootbox.confirm('Are you sure? Clicking this will make the Booking Paid', function(confirm){
			if(confirm){	
					var bookId = a.rel;
					var currentBooking = Books.findOne({'_id' : bookId});
					var vendor = Meteor.user().profile.name;
					var transaction = {
						'bookId' : currentBooking._id,
						'date' : new Date(),
						'status' : 'Given',
						'amount' : parseInt(currentBooking.totalISK),
						'detail' : "Quick Paid",
						'vendor' : vendor,
						'type' : 'Cash Office'
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
			});
			
		},

		'click .changeStatusBooking' : function(event) {
			event.preventDefault();
			var a = event.currentTarget;
			bootbox.confirm('Are you sure? Clicking this will make the Booking Canceled', function(confirm){
				if(confirm){
					
					var id = a.rel;
					book = Books.findOne(id);
					var vendor = Meteor.user().profile.name;

					var dateToday = new Date();
					var dateTodayFixed = new Date(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate(), 0,0,0);
					var dateOfBookingFixed = new Date(book.dateOfBooking.getFullYear(), book.dateOfBooking.getMonth(), book.dateOfBooking.getDate(),0,0,0);
					var aDayPreviousBookingDate = new Date(book.dateOfBooking.getFullYear(), book.dateOfBooking.getMonth(), (book.dateOfBooking.getDate() -1), 0,0,0);
					var totalISK = Books.findOne({"_id" : id}).totalISK;
					
					var valueFees;
					if(dateTodayFixed >= aDayPreviousBookingDate){
						valueFees = -3000;
					}else{
						valueFees = parseInt(totalISK * 0.05);
						valueFees = 0-valueFees;
					}
					var transaction = {
							'bookId' : id,
							'date' : dateToday,
							'status' : 'Given',
							'amount' : valueFees,
							'detail' : "Cancelation Fee",
							'vendor' : vendor,
							'type' : 'Refound'
					}
					Transactions.insert(transaction);

					var thisBookingTransactions = Transactions.find({'bookId' : id}).fetch();
					var totalTransactions = 0;
					for (var i = thisBookingTransactions.length - 1; i >= 0; i--) {
						totalTransactions = parseInt(totalTransactions) + parseInt(thisBookingTransactions[i].amount);
					};
					Books.update(id, {$set : {bookStatus: 'Canceled'}});

					var transactionRefund = {
							'bookId' : id,
							'date' : dateToday,
							'status' : 'Given',
							'amount' :  parseInt(book.totalISK) + valueFees,
							'detail' : "Refund provinent from a Cancelation",
							'vendor' : vendor,
							'type' : 'Refund'
					}
					Transactions.insert(transactionRefund);
					
					throwInfo("Cancelation completed! Customer need to be refunded in "+totalTransactions+"ISK. *Cancelation fee already included");
				}
			});		
	},

	'click .confirmBook' :function(event) {
		event.preventDefault();
		var id = event.currentTarget.rel;
		book = Books.findOne({_id : id});
		if(book.confirm){
			Books.update(id, {$set : {confirm : false}});
			throwInfo('Confirm Booking Removed!');
		}else{
			Books.update(id, {$set : {confirm : true}});
			throwInfo('Booking Confirmed!');
		}
	},

	'click .invoicesSent' :function(event) {
		event.preventDefault();
		var id = event.currentTarget.rel;
		book = Books.findOne({_id : id});
		if(book.invoicesSent){
			Books.update(id, {$set : {invoicesSent : false}});
			throwInfo('Invoices Sent Removed!');
		}else{
			Books.update(id, {$set : {invoicesSent : true}});
			throwInfo('Invoices Sent');
		}
	}
});


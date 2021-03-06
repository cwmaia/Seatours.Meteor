Template.overview.products = function(){
	return Products.find();
};

Template.overview.date = function(){
	var date = new Date(localStorage.getItem('date'));
	return date.toUTCString().slice(5,17);
};

Template.overview.trips = function(productId){
	return Trips.find({productId : productId, season : currentSeason()}, { sort : {hour : 1}});
};

Template.overview.isFirst = function(productId){
	if(Products.find().fetch()[0]){
		return Products.find().fetch()[0]._id == productId;
	}else{
		return false;
	}
};

Template.overview.ready = function(){
	return Session.get("changeDates");
};

Template.overview.isBookCreated = function(status) {
	return status == 'Booked';
};

Template.overview.notes = function(bookId) {
	return Notes.find({bookId: bookId, type: "Customer Note"});
};

Template.overview.bookings = function(productId, tripId){
	var date = new Date(localStorage.getItem('date')),
	currentDate = new Date(localStorage.getItem('date')).getTime();

	with(date){
		setDate(getDate() + 1);
	}

	return Books.find({
		dateOfBooking : {$gte: currentDate, $lt: date.getTime()},
		'product._id' : productId,
		'trip._id' : tripId
	}, { sort : {paid : -1, bookStatus: 1}});
};

Template.overview.totalMetersCars = function(productId, tripId){
	var date = new Date(localStorage.getItem('date')),
	currentDate = new Date(localStorage.getItem('date')).getTime();

	with(date){
		setDate(getDate() + 1);
	}

	books = Books.find({
		dateOfBooking : {$gte: currentDate, $lt: date.getTime()},
		'product._id' : productId,
		'trip._id' : tripId
	}).fetch();

	total = 0;

	for (var i = 0; i < books.length; i++) {
		if(books[i].vehicle.size){
			total = parseInt(total + parseInt(books[i].vehicle.size));
		}
	}

	return total;
};

Template.overview.totalLorries = function(productId, tripId){
	var date = new Date(localStorage.getItem('date')),
	currentDate = new Date(localStorage.getItem('date')).getTime();

	with(date){
		setDate(getDate() + 1);
	}

	books = Books.find({
		dateOfBooking : {$gte: currentDate, $lt: date.getTime()},
		'product._id' : productId,
		'trip._id' : tripId
	}).fetch();

	total = 0;

	for (var i = 0; i < books.length; i++) {
		if(books[i].vehicle && books[i].vehicle.category == 'Lorry'){
			total++;
		}
	}

	return total;
};

Template.overview.totalNormalCars = function(productId, tripId){
	var date = new Date(localStorage.getItem('date')),
	currentDate = new Date(localStorage.getItem('date')).getTime();

	with(date){
		setDate(getDate() + 1);
	}

	books = Books.find({
		dateOfBooking : {$gte: currentDate, $lt: date.getTime()},
		'product._id' : productId,
		'trip._id' : tripId
	}).fetch();

	total = 0;

	for (var i = 0; i < books.length; i++) {
		if(books[i].vehicle && books[i].vehicle.category == 'Normal Car'){
			total++;
		}
	}

	return total;
};

Template.overview.totalJeeps = function(productId, tripId){
	var date = new Date(localStorage.getItem('date')),
	currentDate = new Date(localStorage.getItem('date')).getTime();

	with(date){
		setDate(getDate() + 1);
	}

	books = Books.find({
		dateOfBooking : {$gte: currentDate, $lt: date.getTime()},
		'product._id' : productId,
		'trip._id' : tripId
	}).fetch();

	total = 0;

	for (var i = 0; i < books.length; i++) {
		if(books[i].vehicle && books[i].vehicle.category == 'Jeep'){
			total++;
		}
	}

	return total;
};

Template.overview.totalSmallCars = function(productId, tripId){
	var date = new Date(localStorage.getItem('date')),
	currentDate = new Date(localStorage.getItem('date')).getTime();

	with(date){
		setDate(getDate() + 1);
	}

	books = Books.find({
		dateOfBooking : {$gte: currentDate, $lt: date.getTime()},
		'product._id' : productId,
		'trip._id' : tripId
	}).fetch();

	total = 0;

	for (var i = 0; i < books.length; i++) {
		if(books[i].vehicle && books[i].vehicle.category == 'Small Car'){
			total++;
		}
	}

	return total;
};

Template.overview.totalPersons = function(productId, tripId){
	var date = new Date(localStorage.getItem('date')),
	currentDate = new Date(localStorage.getItem('date')).getTime();

	with(date){
		setDate(getDate() + 1);
	}

	books = Books.find({
		dateOfBooking : {$gte: currentDate, $lt: date.getTime()},
		'product._id' : productId,
		'trip._id' : tripId
	}).fetch();

	total = 0;

	for (var i = 0; i < books.length; i++) {
		for (var j = 0; j < books[i].prices.length; j++) {
			if(books[i].prices[j].price != "Operator Fee")
				total = parseInt(total + parseInt(books[i].prices[j].persons));
		}
	}

	return total;
};

Template.overview.fullname = function(id){
	return Customers.findOne({_id: id}).fullName;
};

Template.overview.telephone = function(id){
	return Customers.findOne({_id: id}).telephone;
};

Template.overview.hasVehicle = function(){
	return this.vehicle.category;
};

Template.overview.total = function(tripId, productId){
	var total = 0;
	var date = new Date(localStorage.getItem('date')),
	currentDate = new Date(localStorage.getItem('date')).getTime();

	with(date){
		setDate(getDate() + 1);
	}

	books =  Books.find({
		dateOfBooking : {$gte: currentDate, $lt: date.getTime()},
		'product._id' : productId,
		'trip._id' : tripId
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		total += parseInt(books[i].totalISK);
	}

	return total;
};

Template.overview.totalPaid = function(tripId, productId){
	var total = 0;
	var date = new Date(localStorage.getItem('date')),
	currentDate = new Date(localStorage.getItem('date')).getTime();

	with(date){
		setDate(getDate() + 1);
	}

	books =  Books.find({
		dateOfBooking : {$gte: currentDate, $lt: date.getTime()},
		'product._id' : productId,
		'trip._id' : tripId
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		transactions = Transactions.find({bookId : books[i]._id}).fetch();
		for (var j = 0; j < transactions.length; j++) {
			if(transactions[j].type == "Credit Card" || transactions[j].type == "Cash Office")
				total += parseInt(transactions[j].amount);
		}
	}

	return total;
};

Template.overview.totalNotPaid = function(tripId, productId){
	var total = 0;
	var totalTransactions = 0;
	var date = new Date(localStorage.getItem('date')),
	currentDate = new Date(localStorage.getItem('date')).getTime();

	with(date){
		setDate(getDate() + 1);
	}

	books =  Books.find({
		dateOfBooking : {$gte: currentDate, $lt: date.getTime()},
		'product._id' : productId,
		'trip._id' : tripId,
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		transactions = Transactions.find({bookId : books[i]._id}).fetch();
		for (var j = 0; j < transactions.length; j++) {
			if(transactions[j].type == "Credit Card" || transactions[j].type == "Cash Office")
				totalTransactions += parseInt(transactions[j].amount);
		}
		if(totalTransactions < books[i].totalISK){
			total += books[i].totalISK - totalTransactions;
		}
		totalTransactions = 0;
	}

	return total;
};

Template.overview.creditcard = function(tripId, productId){
	var total = 0;
	var date = new Date(localStorage.getItem('date')),
	currentDate = new Date(localStorage.getItem('date')).getTime();

	with(date){
		setDate(getDate() + 1);
	}

	books =  Books.find({
		dateOfBooking : {$gte: currentDate, $lt: date.getTime()},
		'product._id' : productId,
		'trip._id' : tripId,
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		transactions = Transactions.find({bookId : books[i]._id}).fetch();
		for (var j = 0; j < transactions.length; j++) {
			if(transactions[j].type == 'Credit Card'){
				total += parseInt(transactions[j].amount);
			}
		}
	}

	return total;
};

Template.overview.refund = function(tripId, productId){
	var total = 0;
	var date = new Date(localStorage.getItem('date')),
	currentDate = new Date(localStorage.getItem('date')).getTime();

	with(date){
		setDate(getDate() + 1);
	}

	books =  Books.find({
		dateOfBooking : {$gte: currentDate, $lt: date.getTime()},
		'product._id' : productId,
		'trip._id' : tripId,
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		transactions = Transactions.find({bookId : books[i]._id}).fetch();
		for (var j = 0; j < transactions.length; j++) {
			if(transactions[j].type == 'Refund'){
				total += parseInt(transactions[j].amount);
			}
		}
	}

	return total;
};

Template.overview.office = function(tripId, productId){
	var total = 0;
	var date = new Date(localStorage.getItem('date')),
	currentDate = new Date(localStorage.getItem('date')).getTime();

	with(date){
		setDate(getDate() + 1);
	}

	books =  Books.find({
		dateOfBooking : {$gte: currentDate, $lt: date.getTime()},
		'product._id' : productId,
		'trip._id' : tripId,
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		transactions = Transactions.find({bookId : books[i]._id}).fetch();
		for (var j = 0; j < transactions.length; j++) {
			if(transactions[j].type == 'Cash Office'){
				total += parseInt(transactions[j].amount);
			}
		}
	}

	return total;
};

Template.overview.totalPassagers = function(id){
	var persons = 0;
	book = Books.findOne({_id : id});
	for (var i = 0; i < book.prices.length; i++) {
		if(book.prices[i].price != "Operator Fee")
			persons = parseInt(persons + parseInt(book.prices[i].persons));
	}
	return persons;
};

Template.overview.ticketNotPrinted = function(id){
	return !Books.findOne({_id : id}).ticketPrinted;
};

Template.overview.lineColor = function(paid, bookStatus, ticketPrinted){
	if(paid && bookStatus == "Booked" && !ticketPrinted){
		return 'green';
	}else if(paid && bookStatus == "Booked" && ticketPrinted){
		return 'purple';
	}else if(paid && bookStatus == 'Canceled'){
		return 'orange';
	}else{
		return "red";
	}

};

Template.overview.created = function(){
	Session.set("changeDates", true);
};

Template.overview.rendered = function(){
	var oTable = $(".datatable").dataTable({
		"iDisplayLength": 25,
		"bServerSide": false,
    "bDestroy": true
	});

	$(".formattedAsMoney").maskMoney({thousands:'.', allowNegative:'true', precision:'0'});
	$(".formattedAsMoney").maskMoney('mask');
	$(".datePickerWYear").datepicker({
		format : 'dd M yyyy'
	}).on('changeDate', function(ev){
			Session.set("changeDates", false);
			date = new Date(ev.date);
			with(date){
				setDate(getDate() + 1);
				setHours(0);
				setMinutes(0);
				setSeconds(0);
			}
			localStorage.setItem('date', date);
			Session.set("changeDates", true);
	});

};


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
					};
					Transactions.insert(transaction);
					Books.update(currentBooking._id, {$set : {'paid' : true}});
					var note = {
							created : new Date(),
							type : 'Quick Pay Note',
							note : vendor + " marked the booking ID#"+ currentBooking.refNumber + " as paid",
							bookId : Session.get('currentBooking')
					};

					Notes.insert(note);
				}
			});

		},

		'click .printTicket' : function(event){
			event.preventDefault();
			var id = event.currentTarget.rel;
			var book = Books.findOne({'_id' : id});
			if(book.ticketPrinted){
				Books.update(id, {$set : {ticketPrinted : false}});
				throwInfo('Canceled Ticket Printed!');
			}else{
				Books.update(id, {$set : {ticketPrinted : true}});
				throwInfo('Ticket Printed!');
			}
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
							'type' : 'CancelationFine'
					};
					Transactions.insert(transaction);

					var thisBookingTransactions = Transactions.find({'bookId' : id}).fetch();
					var totalTransactions = 0;
					for (var i = thisBookingTransactions.length - 1; i >= 0; i--) {
						totalTransactions = parseInt(totalTransactions) + parseInt(thisBookingTransactions[i].amount);
					}
					Books.update(id, {$set : {bookStatus: 'Canceled'}});

					var transactionRefund = {
							'bookId' : id,
							'date' : dateToday,
							'status' : 'Given',
							'amount' :  parseInt(book.totalISK) + valueFees,
							'detail' : "Refund provinent from a Cancelation",
							'vendor' : vendor,
							'type' : 'Refund'
					};
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

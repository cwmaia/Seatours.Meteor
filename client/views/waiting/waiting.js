Template.waitingList.bookings = function(){
	
	console.log(Books.find({'pendingApproval': true}).fetch());
	return Books.find({'pendingApproval': true});
}

Template.overview.hasVehicle = function(){
	return this.vehicle.category;
}

Template.waitingList.lineColor = function(paid, bookStatus){
	if(paid && bookStatus == "Allocated pending confirmation"){
		return 'green';
	}else if(paid && bookStatus == 'Paid but not yet confirmed'){
		return 'orange';
	}else{
		return "red";
	}
	
}

Template.waitingList.customerName = function(customerId){
	return Customers.findOne({'_id' : customerId}).fullName;
}

Template.waitingList.totalPassagers = function(id){
	var persons = 0;
	book = Books.findOne({_id : id});
	for (var i = 0; i < book.prices.length; i++) {
		if(book.prices[i].price != "Operator Fee")
			persons = parseInt(persons + parseInt(book.prices[i].persons));
	};
	return persons;
}

Template.waitingList.telephone = function(id){
	return Customers.findOne({_id: id}).telephone;
}

Template.waitingList.notPaid = function(id){
	var book = Books.findOne({_id : id});
	return !book.paid;
}

Template.waitingList.notAllocated = function(id){
	var book = Books.findOne({_id : id});
	return (book.slot != null);
}

Template.waitingList.rendered = function(){
	$("#transactionDialog").hide();
}

Template.waitingList.vendor = function(){
	return Meteor.user().profile.name;
}

Template.waitingList.events({
		'click .cancel, click .close' : function(){
			$("#transactionDialog").hide();
		},

		'click .makePayment' : function(event){
			event.preventDefault();
			var a = event.currentTarget;
			var bookId = a.rel;
			Session.set("currentBooking", bookId);
			var totalISK = Books.findOne({"_id" : Session.get('currentBooking')}).totalISK;
			var thisBookingTransactions = Transactions.find({'bookId' : Session.get('currentBooking')}).fetch();
			var totalTransactions = 0;
			for (var i = thisBookingTransactions.length - 1; i >= 0; i--) {
				totalTransactions = totalTransactions + thisBookingTransactions[i].amount;
			};
			var totalToPay = totalISK - totalTransactions;
			$("#toPay").text(totalToPay);
			$("#transactionDialog").show();
		},
		'click .saveTransaction' : function(){

		//calc total amount with discount
		var amount = $('#amount').val();
		amount = parseInt(amount);
		var type = $('#type').val();
		var detail = $('#detail').val();

		if(!amount){
			throwError('Please Add the Amount for the Transaction');
			return;
		}

		if(!type){
			throwError('Please Add the type of Transaction');
			return;
		}

		var transaction = {
			'bookId' : Session.get('bookId'),
			'date' : new Date(),
			'status' : 'Processing',
			'amount' : amount,
			'detail' : detail,
			'vendor' : Meteor.user().profile.name,
			'type' : type
		}

		Transactions.insert(transaction);

		//Check if all was paid
		var bookId = Session.get('bookId');
		var totalISK = Books.findOne({"_id" : Session.get('bookId')}).totalISK;
		var thisBookingTransactions = Transactions.find({'bookId' : bookId}).fetch();
		var totalTransactions = 0;
		for (var i = thisBookingTransactions.length - 1; i >= 0; i--) {
			totalTransactions = parseInt(totalTransactions + thisBookingTransactions[i].amount);
		};

		if( totalISK == totalTransactions){
			Books.update(bookId, {$set : {paid : true}});
		}
		Books.update(currentBooking._id, {$set : {'bookStatus' : "Paid but not yet confirmed"}});
		
		$("#transactionDialog").hide();
		
	},
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
					Books.update(currentBooking._id, {$set : {'bookStatus' : "Paid but not yet confirmed"}});
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
	'click .confirm' : function(){
		var a = event.currentTarget;
		var bookId = a.rel;
		var currentBooking = Books.findOne({'_id' : bookId});
		Books.update(currentBooking._id, {$set : {'bookStatus' : "Booked"}});
		Books.update(currentBooking._id, {$set : {'pendingApproval' : false}});
		throwInfo('Booking Confirmed!');
		Meteor.Router.to("/bookDetailResume/"+book._id);
	}

})

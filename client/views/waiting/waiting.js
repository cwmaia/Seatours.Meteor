Template.waitingList.bookings = function(){
	return Books.find({
	$or : [{'pendingApproval': true}, {slot : /.*W.*/}]
	});
};

Template.overview.hasVehicle = function(){
	return this.vehicle.category;
};

Template.waitingList.lineColor = function(paid, bookStatus){
	if(paid && bookStatus == "Allocated pending confirmation"){
		return 'green';
	}else if(paid && bookStatus == 'Paid but not yet confirmed'){
		return 'orange';
	}else{
		return "red";
	}
};

Template.waitingList.customerName = function(customerId){
	return Customers.findOne({'_id' : customerId}).fullName;
};

Template.waitingList.date = function(date){
	return date.toLocaleDateString("pt-BR");
};

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
	$("#aloccationSlot").hide();
	var oTable = $('#waitingListTable').dataTable({
		"iDisplayLength": 50
	});
	oTable.fnSort( [ [1,'asc'] ]);
	$('[data-rel=popover]').popover({html:true});
}

Template.waitingList.vendor = function(){
	return Meteor.user().profile.name;
}

var updateSVGFill = function(bookId){

	book = Books.findOne(bookId);

	dateBase = book.dateOfBooking;

	selectedDay = new Date();
	nextDay = new Date();

	with(selectedDay){
		setDate(dateBase.getDate());
		setHours(0);
		setMinutes(0);
		setSeconds(0);
		setMilliseconds(0);
	}

	with(nextDay){
		setDate(dateBase.getDate() + 1);
		setHours(0);
		setMinutes(0);
		setSeconds(0);
		setMilliseconds(0);
	}

	dates = {
		selectedDay : selectedDay,
		nextDay : nextDay
	}

	books = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: book.trip._id,
		$or: [ { bookStatus: "Booked"}, { bookStatus: "Waiting Payment (credit card)" } ]
	}).fetch();

	//Update Boat Status SVG
	for (var i = books.length - 1; i >= 0; i--) {
		var slot = books[i].slot.split("-");
		for (var j = slot.length - 1; j >= 0; j--) {
			var svgElement = document.getElementById("svg_"+slot[j]);
			svgElement.setAttribute("fill", "#808080");
		};
	};

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
		$("rect").filter(function(){
			var id = $(this).attr("id");
			svgElement = document.getElementById(id);
			svgElement.setAttribute("stroke", "#000000");
			if(svgElement.className.animVal == "greenSlot"){
				svgElement.setAttribute("fill", "#87b87f");
			}else if(svgElement.className.animVal == "blueSlot"){
				svgElement.setAttribute("fill", "#6fb3e0");
			}else if(svgElement.className.animVal == "redSlot"){
				svgElement.setAttribute("fill", "#d15b47");
			}else if(svgElement.className.animVal == "orangeSlot"){
				svgElement.setAttribute("fill", "#ffb752");
			}else{
				svgElement.setAttribute("fill", "#ffffff");
			}
		})

		var a = event.currentTarget;
		var bookId = a.rel;
		updateSVGFill(bookId);
		$("#waitingBookId").val(bookId);
		$("#aloccationSlot").show();
	},

	'click .alocateAndSave' : function(){
		if($("#slotAloccated").val() == ""){
			throwError("Please select an slot for this booking");
		}else{
			var currentBooking = Books.findOne($("#waitingBookId").val());
			Books.update(currentBooking._id, {$set : {bookStatus: 'Booked', pendingApproval : false, slot : $("#slotAloccated").val()}});
			throwInfo('Booking Confirmed!');
			Meteor.Router.to("/bookDetailResume/"+book._id);
		}
	},

	'click .close, click .cancel' : function(event){
		$("#aloccationSlot").hide();
	},

	'click rect' : function(event){
		var id = event.target.id;
		svgElement = document.getElementById(id);
		var stroke = svgElement.getAttribute("stroke");
		var fill = svgElement.getAttribute("fill");
		if(stroke == "#000000" && fill != "#808080"){
			var text = $("#slotAloccated").val();
			if(text == ""){
				text+=id.split("_")[1];
			}else{
				text+="-"+id.split("_")[1];
			}
			$("#slotAloccated").val(text);
			svgElement.setAttribute("stroke","#00d2ff");
		}else{
			var text = "";
			var textSplit = $("#slotAloccated").val().split("-");
			for (var i = 0; i < textSplit.length; i++) {
				if(textSplit[i] != id.split("_")[1]){
					if(text == ""){
						text += textSplit[i];
					}else{
						text += "-"+textSplit[i];
					}
				}
			};
			$("#slotAloccated").val(text);
			svgElement.setAttribute("stroke","#000000");
		}

	}

})

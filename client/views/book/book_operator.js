var SaveCustomer = true;
var ExtraSlot = '';
var CanSaveTheBook = true;
var Product = {};
var CarsToMove = [];


var extraSlots = ['NO', 'EXTRASLOT1', 'EXTRASLOT2'];

var getExtraSlotsSpace = function(trip){
	var dates = getSelectedAndNextDay();
	var extraSpace1 = 0;
	var extraSpace2 = 0;
	var count5m = 0;

	books = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip.from' 	: trip.from,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[0]
	}).fetch();

	if(count5m < 25){
		extraSpace1 = 24;
		extraSpace2 = 24;
	}

	if(count5m >= 25 && count5m < 27){
		extraSpace1 = 24;
		extraSpace2 = 19;
	}

	if(count5m >= 27 && count5m < 28){
		extraSpace1 = 19;
		extraSpace2 = 19;
	}

	if(count5m > 28 && count5m < 30){
		extraSpace1 = 19;
		extraSpace2 = 15;
	}

	extraSpace = {
		extraSpace1 : extraSpace1,
		extraSpace2 : extraSpace2
	}

	return extraSpace;
}
var realocate = function(size, booksSlot1, booksSlot2, sumSpacesSlot1, sumSpacesSlot2, extraSpace1, extraSpace2){


	temporalFreeSpace1 = extraSpace1 - sumSpacesSlot1;
	temporalFreeSpace2 = extraSpace2 - sumSpacesSlot2;

	//It can goes on slot 1?
	if(size <= extraSpace1){
		temporalFreeSpace1 = extraSpace1 - sumSpacesSlot1;
		temporalFreeSpace2 = extraSpace2 - sumSpacesSlot2;

		//Tries to move cars to slot 2
		var CarsToMove = [];
		for (var i = 0; i < booksSlot1.length; i++) {
			if(booksSlot1[i].vehicle.size <= temporalFreeSpace2){
				CarsToMove.push(booksSlot1[i]);
				temporalFreeSpace2 -= parseInt(booksSlot1[i].vehicle.size);
				temporalFreeSpace1 += parseInt(booksSlot1[i].vehicle.size);
				if(size <= temporalFreeSpace1){
					for (var j = 0; j < CarsToMove.length; j++) {
						CarsToMove[j].vehicle.extraSlot = extraSlots[2];
						Books.update(CarsToMove[j]._id, CarsToMove[j]);
					};

					return extraSlots[1];
				}
			}
		};
	//It can goes on slot 2?
	}else if(size <= extraSpace2){
		temporalFreeSpace1 = extraSpace1 - sumSpacesSlot1;
		temporalFreeSpace2 = extraSpace2 - sumSpacesSlot2;

		var CarsToMove = [];
		for (var i = 0; i < booksSlot2.length; i++) {
			if(booksSlot2[i].vehicle.size <= temporalFreeSpace1){
				CarsToMove.push(booksSlot1[i]);
				temporalFreeSpace1 -= booksSlot1[i].vehicle.size;
				temporalFreeSpace2 += booksSlot1[i].vehicle.size;
				if(size <= temporalFreeSpace2){
					for (var j = 0; j < CarsToMove.length; j++) {
						CarsToMove[j].vehicle.extraSlot = extraSlots[1];
						Books.update(CarsToMove[j]._id, CarsToMove[j]);
					};

					return extraSlots[2];
				}
			}
		};
	//So sad can't go
	}else{
		return false;
	}
	

}

var getSelectedAndNextDay = function(){
	var selectedDay = Session.get('bookingDate');
	var nextDay = Session.get('bookingDate');

	with(nextDay){
		setDate(getDate() +1);	
	}

	var dates = {
		selectedDay : selectedDay,
		nextDay : nextDay
	}

	return dates;
}

var doorMaxCapacity = function (trip){
	var dates = getSelectedAndNextDay();
	var count6m = 0;
	var count5m = 0;
	var max5mCars = 0;

	books = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip.from' 	: trip.from,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[0]
	}).fetch();

	for (var i = books.length - 1; i >= 0; i--) {
		if(books[i].vehicle.size <= 5){
			count5m++;
		}
		if(books[i].vehicle.size > 5 && books[i].vehicle.size <= 6){
			count6m++;
		}
	};

	extraSpace = getExtraSlotsSpace(trip);

	sumExtraSpace = parseInt(extraSpace.extraSpace1 + extraSpace.extraSpace2);

	if(sumExtraSpace <= 48){
		max5mCars = 24;
	}

	if(sumExtraSpace <= 43){
		max5mCars = 25;
	}

	if(sumExtraSpace <= 38){
		max5mCars = 27;
	}

	if(sumExtraSpace <= 33){
		max5mCars = 28;
	}

	if(sumExtraSpace <= 30){
		max5mCars = 30;
	}

	if(count5m == max5mCars){
		return true;
	}

	if(count6m == 4){
		return true;
	}

	return false;
	
}

var checkSpaceExtra = function(size, trip){
	var dates = getSelectedAndNextDay();
	var count5m = 0;

	booksSlot1 = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip.from' 	: trip.from,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[1]
	}).fetch();

	booksSlot2 = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip.from' 	: trip.from,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[2]
	}).fetch();

	extraSpace = getExtraSlotsSpace(trip);

	sumSpacesSlot1 = 0;
	sumSpacesSlot2 = 0;

	for (var i = 0; i < booksSlot1.length; i++) {
		sumSpacesSlot1 += parseInt(booksSlot1[i].vehicle.size);
	};
	for (var i = 0; i < booksSlot2.length; i++) {
		sumSpacesSlot2 += parseInt(booksSlot2[i].vehicle.size);
	};

	freeSpaceSlot1 = parseInt(extraSpace.extraSpace1 - sumSpacesSlot1);
	freeSpaceSlot2 = parseInt(extraSpace.extraSpace2 - sumSpacesSlot2);
	
	if(size <= freeSpaceSlot1){
		return extraSlots[1];
	}else if(size <= freeSpaceSlot2){
		return extraSlots[2];
	}else{
		//Tries to realocate
		return realocate(size, booksSlot1, booksSlot2, sumSpacesSlot1, sumSpacesSlot2, extraSpace.extraSpace1, extraSpace.extraSpace2);
	}
}

var countExtraSpace = function(){

	var dates = getSelectedAndNextDay();
	var trip = Trips.findOne(Session.get('tripId'));
	var spaceAlocatedSlot1 = 0;
	var spaceAlocatedSlot2 = 0;
	var spaceAlocated = 0;
	var max5slots = 30;

	booksSlot1 = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip.from' 	: trip.from,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[1]
	}).fetch();


	booksSlot2 = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip.from' 	: trip.from,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[2]
	}).fetch();

	for (var i = booksSlot1.length - 1; i >= 0; i--) {
		spaceAlocatedSlot1 += parseInt(booksSlot1[i].vehicle.size);
	};

	for (var i = booksSlot2.length - 1; i >= 0; i--) {
		spaceAlocatedSlot2 += parseInt(booksSlot2[i].vehicle.size);
	};

	spaceAlocated = parseInt(spaceAlocatedSlot1 + spaceAlocatedSlot2);

	if(spaceAlocated == 48){
		max5slots = 24;
	}

	if(spaceAlocated >= 43 && spaceAlocated < 48){
		max5slots = 25;
	}

	if(spaceAlocated >= 38 && spaceAlocated < 43){
		max5slots = 27;
	}

	if(spaceAlocated >= 33 && spaceAlocated < 38){
		max5slots = 28;
	}

	if(spaceAlocated >= 30 && spaceAlocated < 33){
		max5slots = 30;
	}

	$("#max5slots").text('Max Qtd: '+parseInt(max5slots));
	$("#spaceAlocatedSlot1").text(spaceAlocatedSlot1);
	$("#spaceAlocatedSlot2").text(spaceAlocatedSlot2);
	$("#spaceAlocated").text(parseInt(spaceAlocated));
	
}

var checkHaveToOpenDoor = function(size, trip){	

	var dates = getSelectedAndNextDay();
	var count5m = 0;
	var count6m = 0;

	books = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip.from' 	: trip.from,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[0]
	}).fetch();

	for (var i = books.length - 1; i >= 0; i--) {
		if(books[i].vehicle.size <= 5){
			count5m++;
		}

		if(books[i].vehicle.size > 5 && books[i].vehicle.size <= 6){
			count6m++;
		}
	};

	if(size <= 5){
		if(count5m < 21){
			return false;
		}

		if(count5m > 21){
			return false;
		}
	}

	if(size > 5 && size <= 6){
		if(count6m < 2){
			return false;
		}

		if(count6m > 2){
			return false;
		}
	}

	return true;
}


///////////////////////////////////////////
//Template Book Operator
Template.bookOperator.rendered = function() {
	$('.calendar').datepicker({
		onSelect: function() {
			var productId = $(this).parents('li')[0].id,
			select = $('#trip_' + productId);

			if(select[0].checkValidity()){
				var date = $(this).datepicker('getDate');
				
				Session.set('bookingDate', date);
				Session.set('tripId', select.val());

				Meteor.Router.to("/bookOperator/" + $(this).parents('li')[0].id);
			}
			else
				showPopover(select, 'Choose the trip');
		},
		'onChangeMonthYear': function(year, month) {
			var calendar = this;

			$(calendar).attr('data-month', month).attr('data-year', year);

			if($(calendar).closest('li').find('select').val().length > 5){
				setTimeout(function() {
					setCalendarCapacity($(calendar));
				}, 10);
			}
		}
	});
}

Template.bookOperator.helpers({
	'product' : function(){
		return Products.find();
	},

	'getTripsByProduct' : function(productId) {
		var trips = [],
		product = Products.findOne(productId);

		for (var i = product.trips.length - 1; i >= 0; i--)
			trips.push(Trips.findOne(product.trips[i]));

		return trips;
	}
})

Template.bookOperator.events({
	'change .trip': function(event) {
		setCalendarCapacity($(event.currentTarget).closest('li').find('.calendar'))
	}
});

function setCalendarCapacity (calendar) {
	var date = new Date(),
	days = $('.ui-datepicker-calendar:first a').length,
	from = calendar.closest('li').find('select')[0].selectedOptions[0].getAttribute('data-from'),
	product = Products.findOne(calendar.closest('li')[0].id),
	maxCapacity = Boats.findOne(product.boatId).maxCapacity,
	bookings = [];

	date.setMonth(calendar.attr('data-month') - 1);
	date.setYear(calendar.attr('data-year'));
	date.setHours(0, 0, 0);

	$('.isFull').removeClass('isFull');

	for (var j = 1; j <= days; j++) {
		date.setDate(j + 1);
		bookings = Books.find({dateOfBooking: {$gte: new Date(date.getFullYear(), date.getMonth(), j), $lt:date}, 'product._id': product._id, 'trip.from': from});

		if(bookings.count() >= maxCapacity)
			$(calendar).find('tbody a:eq(' + (j - 1) + ')').addClass('isFull')
		

		// if(bookings.count() > 0)
		// 	console.log('Day: %s, %s bookings - %s max capacity', j, bookings.count(), Boats.findOne(product.boatId).maxCapacity);
	}
}
///////////////////////////////////////////
//Template Book Detail
Template.bookDetail.rendered = function() {
	$('#passengers').dataTable();
	$('#boatSlots').dataTable();
	countExtraSpace();
}

Template.bookDetail.fullname = function(id){
	return Customers.findOne({_id: id}).fullName;
}

Template.bookDetail.qtdCarsUpTo5 = function(){
	var dates = getSelectedAndNextDay();
	var trip = Trips.findOne(Session.get('tripId'));
	
	var count = 0;

	books = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip.from' 	: trip.from,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[0]
	}).fetch();

	for (var i = books.length - 1; i >= 0; i--) {
		if(books[i].vehicle.size <= 5){
			count++;
		}
	};

	return count;
}

Template.bookDetail.qtdCarsUpTo6 = function(){
	var dates = getSelectedAndNextDay();
	var trip = Trips.findOne(Session.get('tripId'));
	var count = 0;

	books = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip.from' 	: trip.from,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[0]
	}).fetch();

	for (var i = books.length - 1; i >= 0; i--) {
		if(books[i].vehicle.size > 5 && books[i].vehicle.size <= 6){
			count++;
		}
	};
	
	return count;
}

//Global Vars
var MaxCapacity = 0;

Template.bookDetail.events({
	'click #newBooking' :function(event) {
		var bookingsCreated = Books.find({dateOfBooking: Session.get('bookingDate'), 'product._id': Session.get('productId'), bookStatus: 'Created'});
		if(bookingsCreated.length >= MaxCapacity)
			throwError('Maximum capacity of passengers reached!');	
		else
			Meteor.Router.to("/bookOperator/" + Session.get('productId') + '/new');
	},

	// 'click .changeStatusBooking' : function(event) {
	// 	var id = $(event.currentTarget).closest('tr').attr('id'),
	// 	book = Books.findOne(id);

	// 	book.bookStatus == 'Canceled' ? book.bookStatus = 'Created' : book.bookStatus = 'Canceled';
	// 	Books.update(id, book);
	// }

	'click .changeStatusBooking' : function(event) {
		var id = $(event.currentTarget).closest('tr').attr('id'),
		book = Books.findOne(id);

		book.bookStatus = 'Canceled';
		Books.update(id, book);
	}
});

Template.bookDetail.helpers({
	boat: function() {
		var boatId = Products.findOne({_id: Session.get('productId')}).boatId;
		var boat = Boats.findOne({_id: boatId});
		MaxCapacity = boat.maxCapacity;
		return boat;
	},

	product: function() {
		Product = Products.findOne(Session.get('productId'));
		return Product;
	},

	date: function() {
		return Session.get('bookingDate').toLocaleDateString();
	},

	bookings : function(){
		var date = Session.get('bookingDate'),
		trip = Trips.findOne(Session.get('tripId'));

		with(date){
			setDate(getDate() + 1);
		}

		return Books.find({
			dateOfBooking 	: {$gte: Session.get('bookingDate'), $lt: date},
			'product._id' 	: Session.get('productId'),
			'trip.from' 	: trip.from
		});
	},

	isBookCreated : function(status) {
		return status == 'Created';
	},

	isBookingNotFull: function(bookingsCreated, boatCapacity) {
		var isValidDate = true,
		date = new Date();

		if(Session.get('bookingDate').getFullYear() < date.getFullYear())
			isValidDate = false;
		else if(Session.get('bookingDate').getMonth() < date.getMonth())
			isValidDate = false;
		else if(Session.get('bookingDate').getDate() < date.getDate())
			isValidDate = false;

		return (bookingsCreated < boatCapacity) && isValidDate;
	},

	bookingsCreated : function(){
		return Books.find({dateOfBooking: Session.get('bookingDate'), 'product._id': Session.get('productId'), bookStatus : "Created"});
	}
});

///////////////////////////////////////////
//Template Create Book
Template.createBook.productName = function(){
	return Session.get("productId") ? Products.findOne({_id: Session.get("productId")}).name : "" ;
}

Template.createBook.dateOfBooking = function(){
	return Session.get('bookingDate').toLocaleDateString();
}

Template.createBook.helpers({
	"prices" : function(){
		return Session.get("productId") ? Products.findOne({_id: Session.get("productId")}).prices : [] ;
	},

	'trip' : function(){
		return Trips.findOne(Session.get("tripId"));
	},

	'slots' : function(){
		var boatId = Products.findOne({_id: Session.get('productId')}).boatId;
		return Boats.findOne({_id: boatId}).slots;
	}
})

Template.createBook.rendered = function(){
	SaveCustomer = true;
	$("#statusDialog").hide();
	loadTypeahead();
}

Template.createBook.events({
	'click #boatStatus' : function(){
		$("#statusDialog").show();
	},
	'click .cancel, click .close' : function(){
		$("#statusDialog").hide();
	}
})

Template.productPrices.events({
	"change input" : function(event){
		var totalParcial = event.currentTarget.value * this.unit;

		$('#'+this.price).val(totalParcial).text(totalParcial);
		var totalPrice = event.currentTarget.value;
		var totalParcial = totalPrice * this.unit;
		$('#'+this.price).val(totalParcial);
		$('#'+this.unit).val(this.price+"|"+this.unit+"|"+totalPrice+"|"+totalParcial);

		calcTotal();
	}
})

Template.generalPassagerInfo.events({
	'keyup #fullName' : function(event){
		if(event.keyCode != 13)
		{
			$('#customerId').val('');
			$('#title').val('')
	    	$('#birthDate').val('');
	    	$('#email').val('');
	    	$('#telephoneCode').val('');
	    	$('#telephone').val('');
	    	$('#adress').val('');
	    	$('#city').val('');
	    	$('#state').val('');
	    	$('#postcode').val('');
	    	$('#country').val('');
			SaveCustomer = true;
		}
	},
		
	'submit form' : function(event){
		event.preventDefault();

		var form = event.currentTarget;

		if($("#categories").val() != "" && $("#size").val() == "" && !$('#size').is(':disabled')){
			throwError('Please Inform the size of vehicle');
		}else if(!CanSaveTheBook){
			throwError("The Vehicle informed can't go on the boat");
		}else{
			if(form.checkValidity()){

				var customer = {
					"title" : $('#title').val(),
					"fullName" :  $('#fullName').val(),
					"birthDate" : $('#birthDate').val(),
					'email' : $('#email').val(),
					"telephoneCode" : $('#telephoneCode').val(),
					"telephone" : $("#telephone").val(),
					"adress" : $("#adress").val(),
					"city" : $("#city").val(),
					"state" : $('#state').val(),
					"postcode" : $("#postcode").val(),
					"country" : $("#country").val()
	 			}	

	 			var trip = Trips.findOne(Session.get('tripId')),
	 			book = {
					"trip" : {
						'from' 	: trip.from,
						'to' 	: trip.to,
						'hour' 	: trip.hour
					},
					"totalISK" : $("#totalISK").text(),
					'dateOfBooking' : new Date(),
					'bookStatus' : 'Created',
					'product' : Product,
				}
		
				book.vehicle = {
					"vehicleModel" : $("#listvehicles").val(),
					"category" : $("#categories").val(),
					"size" : $("#size").val(),
					"totalCost" : $("#totalVehicle").text()
				}

				if(ExtraSlot){
					book.vehicle.extraSlot = ExtraSlot;
				}else{
					book.vehicle.extraSlot = extraSlots[0];
				}

				if(SaveCustomer){
	 				var resultId = Customers.insert(customer);
	 				customer._id = resultId;
	 				book.customerId = resultId;
	 			}else{
	 				book.customerId = $('#customerId').val();
	 			}
			
				var prices = [];

				$('.unitPrice').filter(function(){
					var split = $(this).val().split("|");
					if(split[2]){
						var price = {
						"prices" : split[0],
						"perUnit" : split[1],
						"persons" : split[2],
						"sum" : split[3]
						}
						
						prices.push(price);
					}
				});

				book.prices = prices;
				book.paid = false;

				var result = Books.insert(book);

				var transaction = {
					'bookId' : result,
					'date' : new Date(),
					'type' : '',
					'status' : 'Waiting Payment',
					'amount' : book.totalISK,
					'detail' : ''
				}

				Transactions.insert(transaction);

				throwSuccess("Book added");

				var html = buildEmail(book, result, customer);

				Meteor.call('sendEmailHTML',
					$('#email').val(),
					'noreply@seatours.com',
					'Your Voucher at Seatours!',
					'<html><head></head><body>Thanks for Booking with us, here is your <b>voucher: </b>'+html+'<hr/>Regards! Seatours Team!<body></html>');

				Meteor.Router.to('/bookDetailResume/'+result);
			}
		}
	}
})

Template.generalPassagerInfo.helpers({
	countries : function() {
		return Countries.find();
	}
})
///////////////////////////////////////////
//Template Booking Vehicles

Template.bookingVehicles.helpers({
	"vehicles" : function(){
		return Vehicles.find();
	}
})

Template.generalPassagerInfo.rendered = function() {
	$('.datepicker').datepicker({
		changeMonth : true,
      	changeYear 	: true,
      	yearRange 	: 'c-100:c-10'
	});

	$('#telephone').mask('(999) 99999999');
	$('#birthDate').mask('99/99/9999');
}

Template.bookingVehicles.rendered = function(){
	var vehicles = Vehicles.find().fetch(),
	finalItems = [];

	for (var i = vehicles.length - 1; i >= 0; i--) {
		finalItems.push({
			id 		: vehicles[i]._id,
			value	: vehicles[i].model + ' - ' + vehicles[i].brandname
		})
	}

	$('#vehicle').typeahead({
		name : 'brandname',
		local: finalItems
	}).bind('typeahead:selected', function (obj, datum) {
		var id = datum.id;

		if(id != ""){
			var category = Vehicles.findOne({_id: id}).category;

			$("#categories option").filter(function(){
				return $(this).text() == category.category;
			}).attr('selected', true);

			$("#size option:first").text(category.size+"m").val(category.size).attr("selected", true);
			
			$("#categories").attr("disabled", true);
			$("#size").attr("disabled", true);

			$("#baseVehicle").val(category.basePrice);

			var totalVehiclePrice = category.basePrice;
			if(category.size > 10){
				var mult = category.size - 10;
				totalVehiclePrice += mult * 1625;
			}

			$("#totalVehicle").text(totalVehiclePrice);
			calcTotal();
		}else{
			$("#categories").removeAttr("disabled");
			$("#size").removeAttr("disabled");
			$("#categories option:first").attr("selected", true);
			$("#size option:first").text("").attr("selected", true);
			$("#size option:first").attr("selected", true);
			$('#vehiclesField input[type=text]').val('');
			calcTotal();
		}
	});
}

Template.bookingVehicles.events({
	'keyup #vehicle' : function(event){
		if(event.keyCode != 13){
			$("#categories").removeAttr("disabled");
			$("#size").removeAttr("disabled");
			$("#categories option:first").attr("selected", true);
			$("#size option:first").text("").attr("selected", true);
			$("#size option:first").attr("selected", true);
			$('#vehiclesField input[type=text]').val('');
			calcTotal();
		}
	}
})

Template.categoryVehicleBook.helpers({
	categories : function(){
		return VehiclesCategory.find();
	}
});

Template.categoryVehicleBook.sizes = function() {
	return Session.get('categoryId') ? VehiclesCategory.findOne({_id: Session.get('categoryId')}).size : [];
}

Template.categoryVehicleBook.events({
	'change #categories' : function(event){
		var id = event.target.selectedOptions[0].id;
		var category = VehiclesCategory.findOne({_id: id});
		if(category){
			$("#baseVehicle").val(category.basePrice);
			$("#totalVehicle").val(0);
			Session.set('categoryId', id);
		}else{
			$("#baseVehicle").val(0);
			$("#totalVehicle").val(0);
			Session.set('categoryId', null);
		}
			
		calcTotal();
	},

	'change #size' : function(event){
		var base = parseInt($("#baseVehicle").val());
		var value = event.target.selectedOptions[0].value;
		var trip = Trips.findOne(Session.get('tripId'));

		if(value == ""){
			$("#totalVehicle").val(0);
			return;
		}

		if(value <= 6){
			showAlert = checkHaveToOpenDoor(value, trip);
			maxCapacity = doorMaxCapacity(Session.get('productId'), trip);

			if(showAlert){
				var result = confirm("Hey You have to open the door to put this car on the boat. Open the Door?");
				if(result){
					ExtraSlot = extraSlots[0];
					CanSaveTheBook = true;
				}else{
					result = confirm("Hey You not open the door, wishes to put on extra slot?");
					if(result){
						fits = checkSpaceExtra(value, trip);
						if(fits){
							ExtraSlot = fits;
							CanSaveTheBook = true;
						}else{
							alert("This car can't be on the boat, this booking can't be created!");
							CanSaveTheBook = false;
						}
					}else{
						alert("This car can't be on the boat, this booking can't be created!");
						CanSaveTheBook = false;
					}
				}
			}else if(value > 5 && value <= 6 && maxCapacity){
				result = confirm("The Door is already full, place the car on extra slots?");
				if(result){
					fits = checkSpaceExtra(value, trip);
					if(fits){
						ExtraSlot = fits;
						CanSaveTheBook = true;
					}else{
						alert("This car can't be on the boat, this booking can't be created!");
						CanSaveTheBook = false;
					}
				}
			}
		}else if(value > 6){
			result = confirm("Place this car on Extra Slot?");
			if(result){
				fits = checkSpaceExtra(value, trip);
				if(fits){
					ExtraSlot = fits;
					CanSaveTheBook = true;
				}else{
					alert("This car can't be on the boat, there is no space for it, this booking can't be created!");
					CanSaveTheBook = false;
				}
			}else{
				alert("This car can't be on the boat, this booking can't be created!");
				CanSaveTheBook = false;
			}
		}
			
		$("#totalVehicle").text(base);
		calcTotal();
	}
})

calcTotal = function(){
	var total = 0;
	$('.calcTotal').filter(function(){
		if($(this).text() != "")
		total += parseInt($(this).text());
	})

	$('#totalISK').text(total);
}

loadTypeahead = function(){
	$('#fullName').typeahead('destroy');
	var items = [],
	finalItems,
	tags = Customers.find({}, {fields: {fullName: 1}});
	tags.forEach(function(tag){
    	var datum = {
    		'value' : tag.fullName,
    		'id' : tag._id
    	}
    	items.push(datum);
	});

	finalItems = _.uniq(items);

	$('#fullName').typeahead({
		name : 'fullName',
		local : finalItems
	}).bind('typeahead:selected', function (obj, datum) {
    	var customer = Customers.findOne({_id: datum.id});

    	$('#customerId').val(customer._id);
    	$('#title').val(customer.title)
    	$('#fullName').val(customer.fullName);
    	$('#birthDate').val(customer.birthDate);
    	$('#email').val(customer.email);
    	$('#telephoneCode').val(customer.telephoneCode);
    	$('#telephone').val(customer.telephone);
    	$('#adress').val(customer.adress);
    	$('#city').val(customer.city);
    	$('#state').val(customer.state);
    	$('#postcode').val(customer.postcode);
    	$('#country').val(customer.country);
    	SaveCustomer = false;
	});
}

buildEmail = function(book, result, customer){
	var prices = '';
	for (var i = 0; i < book.prices.length; i++) {
		prices += book.prices[i].prices + " - " + book.prices[i].persons + " X " + book.prices[i].perUnit + " = " +  book.prices[i].sum + " ISK <br/>";
	};

	var vehicle = '';
	if(book.vehicle.category != ''){
		vehicle = book.vehicle.category +" - "+ book.vehicle.size+ "m = " + book.vehicle.totalCost + " ISK";
	}

	var html = '';
	html += '<div class="page-header">';
	html += '<h1>Voucher</h1>';
	html += '</div>';
	html += '<div class="alert alert-warning" style="font-size: 14px;';
	html += 'border-radius: 0;';
	html += 'adding: 8px 35px 8px 14px;';
	html += 'margin-bottom: 20px;';
	html += 'text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);';
	html += 'background-color: #fcf8e3;';
	html += 'border: 1px solid #fbeed5;';
	html += '-webkit-border-radius: 4px;';
	html += '-moz-border-radius: 4px;';
	html += 'border-radius: 4px;">';
	html += '<b>ATTENTION, PLEASE NOTE:</b>';
	html += 'You need to pick up your ticket from Seatours office (harbour front) at ';
	html += 'least 30 minutes before departure.';
	html += '</div>';
	html += '<div id="voucher" class="line-3" style="float: left; width: 100%; margin: 2% 0;">';
	html += '<section style="float: left; margin-right: 1%; width: 30%;">';
	html += '<h3 style="margin-bottom: 1%; font-style: italic; font-weight: lighter; text-shadow: 2px 1px 1px white;">Address</h3>';
	html += '<p style="font-size: 130%; margin: 0 0 10px;">Smidjustigur 3 - 340 Stykkisholmur</p>';
	html += '</section>';
	html += '<section style="float: left; margin-right: 1%; width: 30%;">';
	html += '<h3 style="margin-bottom: 1%; font-style: italic; font-weight: lighter; text-shadow: 2px 1px 1px white;">Email</h3>';
	html += '<p style="font-weight: lighter; margin: 0 0 10px;">seatours@seatours.is</p>';
	html += '</section>';
	html += '<section style="float: left; margin-right: 1%; width: 30%;">';
	html += '<h3 style="margin-bottom: 1%; font-style: italic; font-weight: lighter; text-shadow: 2px 1px 1px white;">Phone:</h3>';
	html += '<p style="color: #555; margin: 0 0 10px;">354 433 2254</p>';
	html += '</section>';	
	html += '</div>';
	html += '<table class="table table-striped table-bordered trable-hover" style="border: 1px solid #dddddd;';
	html += 'border-collapse: separate;';
	html += 'border-left: 0;';
	html += '-webkit-border-radius: 4px;';
	html += '-moz-border-radius: 4px;';
	html += 'border-radius: 4px;';
	html += 'width: 100%;';
	html += 'margin-bottom: 20px;';
	html += 'max-width: 100%;';
	html += 'background-color: transparent;';
	html += 'border-collapse: collapse;';
	html += 'border-spacing: 0;">';
	html += '<thead>';
	html += '<tr style="color: #707070;';
	html += 'font-weight: normal;';
	html += 'background: #F2F2F2;';
	html += 'background-color: #f3f3f3;';
	html += 'background-image: -moz-linear-gradient(top, #f8f8f8, #ececec);';
	html += 'background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#f8f8f8), to(#ececec));';
	html += 'background-image: -webkit-linear-gradient(top, #f8f8f8, #ececec);';
	html += 'background-image: -o-linear-gradient(top, #f8f8f8, #ececec);';
	html += 'background-image: linear-gradient(to bottom, #f8f8f8, #ececec);';
	html += 'background-repeat: repeat-x;">';
	html += '<th>Booking ID</th>';
	html += '<th>Booking Date</th>';
	html += '<th>Booking Status</th>';
	html += '</tr>';
	html += '</thead>';
	html += '<tbody>';
	html += '<tr>';
	html += '<td style="padding: 8px;';
	html += 'line-height: 20px;';
	html += 'text-align: left;';
	html += 'vertical-align: top;';
	html += 'border-top: 1px solid #dddddd;">'+result+'</td>';
	html += '<td style="padding: 8px;';
	html += 'line-height: 20px;';
	html += 'text-align: left;';
	html += 'vertical-align: top;';
	html += 'border-top: 1px solid #dddddd;">'+book.dateOfBooking.toLocaleDateString()+'</td>';
	html += '<td style="padding: 8px;';
	html += 'line-height: 20px;';
	html += 'text-align: left;';
	html += 'vertical-align: top;';
	html += 'border-top: 1px solid #dddddd;">Waiting Payment</td>';
	html += '</tr>';
	html += '</tbody>';
	html += '</table>';
	html += '<table class="table table-striped table-bordered trable-hover" style="border: 1px solid #dddddd;';
	html += 'border-collapse: separate;';
	html += 'border-left: 0;';
	html += '-webkit-border-radius: 4px;';
	html += '-moz-border-radius: 4px;';
	html += 'border-radius: 4px;';
	html += 'width: 100%;';
	html += 'margin-bottom: 20px;';
	html += 'max-width: 100%;';
	html += 'background-color: transparent;';
	html += 'border-collapse: collapse;';
	html += 'border-spacing: 0;">';
	html += '<thead>';
	html += '<tr style="color: #707070;';
	html += 'font-weight: normal;';
	html += 'background: #F2F2F2;';
	html += 'background-color: #f3f3f3;';
	html += 'background-image: -moz-linear-gradient(top, #f8f8f8, #ececec);';
	html += 'background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#f8f8f8), to(#ececec));';
	html += 'background-image: -webkit-linear-gradient(top, #f8f8f8, #ececec);';
	html += 'background-image: -o-linear-gradient(top, #f8f8f8, #ececec);';
	html += 'background-image: linear-gradient(to bottom, #f8f8f8, #ececec);';
	html += 'background-repeat: repeat-x;">';
	html += '<th>Full Name</th>';
	html += '<th>Full Address</th>';
	html += '<th>Contact Number</th>';
	html += '<th>Email Address</th>';
	html += '</tr>';
	html += '</thead>';
	html += '<tbody>';
	html += '<tr>';
	html += '<td style="padding: 8px;';
	html += 'line-height: 20px;';
	html += 'text-align: left;';
	html += 'vertical-align: top;';
	html += 'border-top: 1px solid #dddddd;">'+customer.fullName+'</td>';
	html += '<td style="padding: 8px;';
	html += 'line-height: 20px;';
	html += 'text-align: left;';
	html += 'vertical-align: top;';
	html += 'border-top: 1px solid #dddddd;">'+customer.adress+'</td>';
	html += '<td style="padding: 8px;';
	html += 'line-height: 20px;';
	html += 'text-align: left;';
	html += 'vertical-align: top;';
	html += 'border-top: 1px solid #dddddd;">'+customer.telephone+'</td>';
	html += '<td style="padding: 8px;';
	html += 'line-height: 20px;';
	html += 'text-align: left;';
	html += 'vertical-align: top;';
	html += 'border-top: 1px solid #dddddd;">'+customer.email+'</td>';
	html += '</tr>';
	html += '</tbody>';
	html += '</table>';
	html += '<div class="alert alert-warning" style="font-size: 14px;';
	html += 'border-radius: 0; ';
	html += 'adding: 8px 35px 8px 14px;';
	html += 'margin-bottom: 20px;';
	html += 'text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);';
	html += 'background-color: #fcf8e3;';
	html += 'border: 1px solid #fbeed5;';
	html += '-webkit-border-radius: 4px;';
	html += '-moz-border-radius: 4px;';
	html += 'border-radius: 4px;">';
	html += 'This Voucher is to accepted as payment fot the following service as';
	html += 'per contratct/agreement';
	html += '</div>';
	html += '<div id="product" class="line-3" style="float: left; width: 100%; margin: 2% 0;">';
	html += '<section style="float: left; margin-right: 1%; width: 30%;">';
	html += '<h3 style="margin-bottom: 1%; font-style: italic; font-weight: lighter; text-shadow: 2px 1px 1px white;">Service</h3>';
	html += '<p style="font-size: 130%; margin: 0 0 10px;">'+book.product.name+'</p>';
	html += '</section>';
	html += '<section style="float: left; margin-right: 1%; width: 30%;">';
	html += '<h3 style="margin-bottom: 1%; font-style: italic; font-weight: lighter; text-shadow: 2px 1px 1px white;">Date</h3>';
	html += '<p style="font-weight: lighter; margin: 0 0 10px;">'+book.dateOfBooking.toDateString()+'</p>';
	html += '</section>';
	html += '<section style="float: left; margin-right: 1%; width: 30%;">';
	html += '<h3 style="margin-bottom: 1%; font-style: italic; font-weight: lighter; text-shadow: 2px 1px 1px white;">Departure Place:</h3>';
	html += '<p style="color: #555; margin: 0 0 10px;">'+book.trip.from+' - '+book.trip.to+' - '+book.trip.hour+'</p>';
	html += '</section>';
	html += '</div>';
	html += '<table class="table table-striped table-bordered trable-hover" style="border: 1px solid #dddddd;';
	html += 'border-collapse: separate;';
	html += 'border-left: 0;';
	html += '-webkit-border-radius: 4px;';
	html += '-moz-border-radius: 4px;';
	html += 'border-radius: 4px;';
	html += 'width: 100%;';
	html += 'margin-bottom: 20px;';
	html += 'max-width: 100%;';
	html += 'background-color: transparent;';
	html += 'border-collapse: collapse;';
	html += 'border-spacing: 0;">';
	html += '<thead>';
	html += '<tr style="color: #707070;';
	html += 'font-weight: normal;';
	html += 'background: #F2F2F2;';
	html += 'background-color: #f3f3f3;';
	html += 'background-image: -moz-linear-gradient(top, #f8f8f8, #ececec);';
	html += 'background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#f8f8f8), to(#ececec));';
	html += 'background-image: -webkit-linear-gradient(top, #f8f8f8, #ececec);';
	html += 'background-image: -o-linear-gradient(top, #f8f8f8, #ececec);';
	html += 'background-image: linear-gradient(to bottom, #f8f8f8, #ececec);';
	html += 'background-repeat: repeat-x;">';
	html += '<th>Items</th>';
	html += '<th>Total</th>';
	html += '</tr>';
	html += '</thead>';
	html += '<tbody>';
	html += '<tr>';
	html += '<td style="padding: 8px;';
	html += 'line-height: 20px;';
	html += 'text-align: left;';
	html += 'vertical-align: top;';
	html += '<td style="padding: 8px;';
	html += 'line-height: 20px;';
	html += 'text-align: left;';
	html += 'vertical-align: top;';
	html += 'border-top: 1px solid #dddddd;">'+prices+'<br/>'+vehicle+'</td>';
	html += '<td style="padding: 8px;';
	html += 'line-height: 20px;';
	html += 'text-align: left;';
	html += 'vertical-align: top;';
	html += '<td style="padding: 8px;';
	html += 'line-height: 20px;';
	html += 'text-align: left;';
	html += 'vertical-align: top;';
	html += 'border-top: 1px solid #dddddd;">'+book.totalISK+' ISK</td>';
	html += '</tr>';
	html += '</tbody>';
	html += '</table>';

	return html;
}

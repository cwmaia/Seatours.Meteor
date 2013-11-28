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

	cartItems = CartItems.find({
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
	};

	for (var i = cartItems.length - 1; i >= 0; i--) {
		if(cartItems[i].vehicle.size <= 5){
			count5m++;
		}
	};

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
						Books.update(CarsToMove[j]._id, {$set : {'vehicle.extraSlot' : extraSlots[2]}});
						CartItems.update(CarsToMove[j]._id, {$set : {'vehicle.extraSlot' : extraSlots[2]}});
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
						Books.update(CarsToMove[j]._id, {$set : {'vehicle.extraSlot' : extraSlots[1]}});
						CartItems.update(CarsToMove[j]._id, {$set : {'vehicle.extraSlot' : extraSlots[2]}});
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

	cartItems = CartItems.find({
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

	for (var i = cartItems.length - 1; i >= 0; i--) {
		if(cartItems[i].vehicle.size <= 5){
			count5m++;
		}
		if(cartItems[i].vehicle.size > 5 && cartItems[i].vehicle.size <= 6){
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

	booksSlot3 = CartItems.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip.from' 	: trip.from,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[1]
	}).fetch();

	booksSlot4 = CartItems.find({
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

	for (var i = 0; i < booksSlot3.length; i++) {
		sumSpacesSlot1 += parseInt(booksSlot3[i].vehicle.size);
		booksSlot1.push(booksSlot3[i]);
	};
	for (var i = 0; i < booksSlot4.length; i++) {
		sumSpacesSlot2 += parseInt(booksSlot4[i].vehicle.size);
		booksSlot2.push(booksSlot4[i]);
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
	var spaceAlocatedSlot3 = 0;
	var spaceAlocatedSlot4 = 0;
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

	booksSlot3 = CartItems.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip.from' 	: trip.from,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[1]
	}).fetch();


	booksSlot4 = CartItems.find({
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

	for (var i = booksSlot3.length - 1; i >= 0; i--) {
		spaceAlocatedSlot3 += parseInt(booksSlot3[i].vehicle.size);
	};

	for (var i = booksSlot4.length - 1; i >= 0; i--) {
		spaceAlocatedSlot4 += parseInt(booksSlot4[i].vehicle.size);
	};

	spaceAlocated = parseInt(spaceAlocatedSlot1 + spaceAlocatedSlot2 + spaceAlocatedSlot3 + spaceAlocatedSlot4);

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
	$("#spaceAlocatedSlot3").text(' On Cart: '+spaceAlocatedSlot3);
	$("#spaceAlocatedSlot4").text(' On Cart: '+spaceAlocatedSlot4);
	$("#spaceAlocated").text(parseInt(spaceAlocated - (spaceAlocatedSlot3 + spaceAlocatedSlot4)));
	$("#spaceAlocatedCart").text(parseInt(spaceAlocatedSlot3 + spaceAlocatedSlot4));
	
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
	ಠ_ಠ();
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
		Books.update(id, {$set : {bookStatus: 'Canceled'}});
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
				createBook();
				throwSuccess("Book added on Cart");
				Meteor.Router.to('/bookOperator');
			}
		}
	},
	'click .procedToCart' : function(){
		if($("#categories").val() != "" && $("#size").val() == "" && !$('#size').is(':disabled')){
			throwError('Please Inform the size of vehicle');
		}else if(!CanSaveTheBook){
			throwError("The Vehicle informed can't go on the boat");
		}else{
			var form = document.getElementById('pasagerInfo');
			if(form.checkValidity()){
				createBook();
				throwSuccess("Book added on Cart");
				Meteor.Router.to('/cart');
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

var createBook = function(){
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
	CartItems.insert(book);
}

    
var data = {
    pieChart  : [
      {
        color       : 'red',
        description : 'Created',
        title       : 'flowers',
        value       : 0.25
      },
      {
        color       : 'blue',
        description : 'Canceled',
        title       : 'trains',
        value       : 0.25
      },
      {
        color       : 'green',
        description : 'Paid',
        title       : 'trains',
        value       : 0.25
      },
      {
        color       : 'orange',
        description : 'What',
        title       : 'trains',
        value       : 0.25
      }
    ]
  };
  
  var DURATION = 1500;
  var DELAY    = 500;



function drawPieChart( elementId, data ) {
    // TODO code duplication check how you can avoid that
    var containerEl = document.getElementById( elementId ),
        width       = containerEl.clientWidth,
        height      = width * 0.4,
        radius      = Math.min( width, height ) / 2,
        container   = d3.select( containerEl ),
        svg         = container.select( 'svg' )
                              .attr( 'width', width )
                              .attr( 'height', height );
    var pie = svg.append( 'g' )
                .attr(
                  'transform',
                  'translate(' + width / 2 + ',' + height / 2 + ')'
                );
    
    var detailedInfo = svg.append( 'g' )
                          .attr( 'class', 'pieChart--detailedInformation' );

    var twoPi   = 2 * Math.PI;
    var pieData = d3.layout.pie()
                    .value( function( d ) { return d.value; } );

    var arc = d3.svg.arc()
                    .outerRadius( radius - 20)
                    .innerRadius( 0 );
    
    var pieChartPieces = pie.datum( data )
                            .selectAll( 'path' )
                            .data( pieData )
                            .enter()
                            .append( 'path' )
                            .attr( 'class', function( d ) {
                              return 'pieChart__' + d.data.color;
                            } )
                            .attr( 'filter', 'url(#pieChartInsetShadow)' )
                            .attr( 'd', arc )
                            .each( function() {
                              this._current = { startAngle: 0, endAngle: 0 }; 
                            } )
                            .transition()
                            .duration( DURATION )
                            .attrTween( 'd', function( d ) {
                              var interpolate = d3.interpolate( this._current, d );
                              this._current = interpolate( 0 );
                    
                              return function( t ) {
                                return arc( interpolate( t ) );
                              };
                            } )
                            .each( 'end', function handleAnimationEnd( d ) {
                              drawDetailedInformation( d.data, this ); 
                            } );

    drawChartCenter(); 
    
    function drawChartCenter() {
      var centerContainer = pie.append( 'g' )
                                .attr( 'class', 'pieChart--center' );
      
      centerContainer.append( 'circle' )
                      .attr( 'class', 'pieChart--center--outerCircle' )
                      .attr( 'r', 0 )
                      .attr( 'filter', 'url(#pieChartDropShadow)' )
                      .transition()
                      .duration( DURATION )
                      .delay( DELAY )
                      .attr( 'r', radius - 50 );
      
      centerContainer.append( 'circle' )
                      .attr( 'id', 'pieChart-clippy' )
                      .attr( 'class', 'pieChart--center--innerCircle' )
                      .attr( 'r', 0 )
                      .transition()
                      .delay( DELAY )
                      .duration( DURATION )
                      .attr( 'r', radius - 55 )
                      .attr( 'fill', '#fff' );
    }
    
    function drawDetailedInformation ( data, element ) {
      var bBox      = element.getBBox(),
          infoWidth = width * 0.3,
          anchor,
          infoContainer,
          position;
      
      if ( ( bBox.x + bBox.width / 2 ) > 0 ) {
        infoContainer = detailedInfo.append( 'g' )
                                    .attr( 'width', infoWidth )
                                    .attr(
                                      'transform',
                                      'translate(' + ( width - infoWidth ) + ',' + ( bBox.height + bBox.y ) + ')'
                                    );
        anchor   = 'end';
        position = 'right';
      } else {
        infoContainer = detailedInfo.append( 'g' )
                                    .attr( 'width', infoWidth )
                                    .attr(
                                      'transform',
                                      'translate(' + 0 + ',' + ( bBox.height + bBox.y ) + ')'
                                    );
        anchor   = 'start';
        position = 'left';
      }

      infoContainer.data( [ data.value * 100 ] )
                    .append( 'text' )
                    .text ( '0 %' )
                    .attr( 'class', 'pieChart--detail--percentage' )
                    .attr( 'x', ( position === 'left' ? 0 : infoWidth ) )
                    .attr( 'y', -10 )
                    .attr( 'text-anchor', anchor )
                    .transition()
                    .duration( DURATION )
                    .tween( 'text', function( d ) {
                      var i = d3.interpolateRound(
                        +this.textContent.replace( /\s%/ig, '' ),
                        d
                      );

                      return function( t ) {
                        this.textContent = i( t ) + ' %';
                      };
                    } );
      
      infoContainer.append( 'line' )
                    .attr( 'class', 'pieChart--detail--divider' )
                    .attr( 'x1', 0 )
                    .attr( 'x2', 0 )
                    .attr( 'y1', 0 )
                    .attr( 'y2', 0 )
                    .transition()
                    .duration( DURATION )
                    .attr( 'x2', infoWidth );
      
      infoContainer.data( [ data.description ] ) 
                    .append( 'foreignObject' )
                    .attr( 'width', infoWidth ) 
                    .attr( 'height', 100 )
                    .append( 'xhtml:body' )
                    .attr(
                      'class',
                      'pieChart--detail--textContainer ' + 'pieChart--detail__' + position
                    )
                    .html( data.description );
    }
  }

function ಠ_ಠ() {
    drawPieChart('pieChart', data.pieChart );
}

var SaveCustomer = true;
var SaveVehicle = false;
var CustomerSelected = false;
var ExtraSlot = '';
var CanSaveTheBook = true;
var Product = {};
var CarsToMove = [];
var CanAdd2Motocycle = false;
var VehicleSelected = false;


var extraSlots = ['NO', 'EXTRASLOT1', 'EXTRASLOT2'];

var updateDataPieChart = function(){
	totalSpace = 150 + 24 + 30;
	var dates = getSelectedAndNextDay();
	var trip = Trips.findOne(Session.get('tripId'));
	var count5m = 0;
	var count6m = 0;
	
	books = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[0]
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		if(books[i].vehicle.size <= 5){
			count5m++;
		}

		if(books[i].vehicle.size > 5 && books[i].vehicle.size <= 6){
			count6m++;
		}
	};
	

	metersFor5mCars = count5m * 5;
	metersFor6mCars = count6m * 6;
	metersForExtraSlots = 0;

	booksSlot1 = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[1]
	}).fetch();

	if(Session.get('isEditing')){
		booksSlot1.splice();
	}

	booksSlot2 = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[2]
	}).fetch();

	for (var i = 0; i < booksSlot1.length; i++) {
		metersForExtraSlots += parseInt(booksSlot1[i].vehicle.size);
	};

	for (var i = 0; i < booksSlot2.length; i++) {
		metersForExtraSlots += parseInt(booksSlot2[i].vehicle.size);
	};

	percentage5m = ((count5m * 5 * 100) / totalSpace).toFixed(2);
	percentage6m = ((count6m * 6 * 100) / totalSpace).toFixed(2);
	percentageLargeCars = ((metersForExtraSlots * 100) / totalSpace).toFixed(2);
	percentageUnllocated = (((totalSpace - metersFor6mCars - metersFor5mCars - metersForExtraSlots) *  100 ) / totalSpace).toFixed(2);

	percentages = {
		percentage5m : percentage5m,
		percentage6m : percentage6m,
		percentageLargeCars : percentageLargeCars,
		percentageUnllocated : percentageUnllocated
	}

	return percentages;
}

var getExtraSlotsSpace = function(trip){
	var dates = getSelectedAndNextDay();
	var extraSpace1 = 0;
	var extraSpace2 = 0;
	var count5m = 0;

	books = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[0]
	}).fetch();

	cartItems = CartItems.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
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
	var selectedDay = new Date(localStorage.getItem('date'));
	var nextDay = new Date(localStorage.getItem('date'));

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
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[0]
	}).fetch();

	if(Session.get('isEditing')){
		if(books.indexOf(Books.findOne(Session.get('bookId')))>=0){
			books.splice(books.indexOf(Books.findOne(Session.get('bookId'))),1);
		}
	}

	cartItems = CartItems.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
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
		CanAdd2Motocycle = true;
		max5mCars = 24;
	}

	if(sumExtraSpace <= 43){
		CanAdd2Motocycle = false;
		max5mCars = 25;
	}

	if(sumExtraSpace <= 38){
		CanAdd2Motocycle = false;
		max5mCars = 27;
	}

	if(sumExtraSpace <= 33){
		CanAdd2Motocycle = false;
		max5mCars = 28;
	}

	if(sumExtraSpace <= 30){
		CanAdd2Motocycle = false;
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
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[1]
	}).fetch();

	if(Session.get('isEditing')){
		if(booksSlot1.indexOf(Books.findOne(Session.get('bookId')))>=0){
			booksSlot1.splice(booksSlot1.indexOf(Books.findOne(Session.get('bookId'))),1);
		}
	}

	booksSlot2 = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[2]
	}).fetch();

	if(Session.get('isEditing')){
		if(booksSlot2.indexOf(Books.findOne(Session.get('bookId')))>=0){
			booksSlot2.splice(booksSlot2.indexOf(Books.findOne(Session.get('bookId'))),1);
		}
	}

	booksSlot3 = CartItems.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[1]
	}).fetch();

	if(Session.get('isEditing')){
		if(booksSlot3.indexOf(Books.findOne(Session.get('bookId')))>=0){
			booksSlot3.splice(booksSlot3.indexOf(Books.findOne(Session.get('bookId'))),1);
		}
	}

	booksSlot4 = CartItems.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[2]
	}).fetch();

	if(Session.get('isEditing')){
		if(booksSlot4.indexOf(Books.findOne(Session.get('bookId')))>=0){
			booksSlot4.splice(booksSlot4.indexOf(Books.findOne(Session.get('bookId'))),1);
		}
	}

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
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[1]
	}).fetch();


	booksSlot2 = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[2]
	}).fetch();

	booksSlot3 = CartItems.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[1]
	}).fetch();


	booksSlot4 = CartItems.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
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
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[0]
	}).fetch();

	cartBooks = CartItems.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Created',
		'vehicle.extraSlot' : extraSlots[0]
	}).fetch();


	if(Session.get('isEditing')){
		if(books.indexOf(Books.findOne(Session.get('bookId')))>=0){
			books.splice(books.indexOf(Books.findOne(Session.get('bookId'))),1);
		}
	}


	for (var i = books.length - 1; i >= 0; i--) {
		if(books[i].vehicle.size <= 5){
			count5m++;
		}

		if(books[i].vehicle.size > 5 && books[i].vehicle.size <= 6){
			count6m++;
		}
	};

	for (var i = cartBooks.length - 1; i >= 0; i--) {
		if(cartBooks[i].vehicle.size <= 5){
			count5m++;
		}

		if(cartBooks[i].vehicle.size > 5 && cartBooks[i].vehicle.size <= 6){
			count6m++;
		}
	};


	if(size <= 5){
		if(count5m < 21){
			return false;
		}
	}

	if(size > 5 && size <= 6){
		if(count6m < 2){
			return false;
		}
	}

	return true;
}


///////////////////////////////////////////
//Template Book Operator
Template.bookOperator.rendered = function() {
	//$('#currentSeason').text(currentSeason());
};


Template.productItem.rendered = function(){
	$('.calendar').datepicker().on('changeDate', function(ev){
			date = new Date(ev.date);
			with(date){
				setDate(getDate() +1 );
				setHours(0);
				setMinutes(0);
				setSeconds(0);
			}
			localStorage.setItem('date', date);
			$('#currentSeason').text(currentSeason());
		})
  	};

Template.productItem.events({
	'click .calendar' : function(event){
		var trips = Trips.find({productId: this._id, active : true, season : currentSeason()}).fetch();
		//Remove all previous options
		$('#trip_'+this._id).find('option').remove();
		for (var i = trips.length - 1; i >= 0; i--) {
			//Append new options
			$('#trip_'+this._id).append("<option value="+trips[i]._id+" data-from="+trips[i].from+">"+trips[i].from +" - "+trips[i].to + " - " +trips[i].hour+"</option>");
		};
	}
})

Template.bookOperator.helpers({
	'product' : function(){
		return Products.find();
	}
})

currentSeason = function(){
	var today = localStorage.getItem('date') ? new Date(localStorage.getItem('date')) : new Date();
	//Check the closest month
	var summerStartMonth = parseInt(Settings.findOne({_id : "summer"}).summerStartDate.split("/")[0])-1;
	var winterStartMonth = parseInt(Settings.findOne({_id : "winter"}).winterStartDate.split("/")[0])-1;
	var temp1 = Math.abs(summerStartMonth - today.getMonth());
	var temp2 = Math.abs(winterStartMonth - today.getMonth());
	var compareDate;
	//if its closer to winter then is going to check from the winter date
	if (temp1 >= temp2){
		//if month is equals or bigger its in the same year
		if (today.getMonth() >= winterStartMonth){
			compareDate = new Date(today.getFullYear(),parseInt(Settings.findOne({_id : "winter"}).winterStartDate.split("/")[0])-1,parseInt(Settings.findOne({_id : "winter"}).winterStartDate.split("/")[1]));
		}else{
			compareDate = new Date(today.getFullYear()+1,parseInt(Settings.findOne({_id : "winter"}).winterStartDate.split("/")[0])-1,parseInt(Settings.findOne({_id : "winter"}).winterStartDate.split("/")[1]));
		}
		if(today >= compareDate){
			return "winter";
		}else{
			return "summer";
		}
	}else{
		//same as for winter
		if (today.getMonth() >= summerStartMonth){
			compareDate = new Date(today.getFullYear(),parseInt(Settings.findOne({_id : "summer"}).summerStartDate.split("/")[0])-1,parseInt(Settings.findOne({_id : "summer"}).summerStartDate.split("/")[1]));
		}else{
			compareDate = new Date(today.getFullYear()+1,parseInt(Settings.findOne({_id : "summer"}).summerStartDate.split("/")[0])-1,parseInt(Settings.findOne({_id : "summer"}).summerStartDate.split("/")[1]));
		}
		if(today >= compareDate){
			return "summer";
		}else{
			return "winter";
		}
	}
}

Template.bookOperator.bookingDate = function(){
	var date = (localStorage.getItem('date') ? new Date(localStorage.getItem('date')) : new Date()).toLocaleDateString();
	return date;
}

Template.bookOperator.currentSeason = function(){
	return currentSeason();
}


Template.bookOperator.events({
	'change .trip': function(event) {
		setCalendarCapacity($(event.currentTarget).closest('li').find('.calendar'))
	},
	'click .proceed': function(event){
		var productId = $(event.currentTarget).parents('li')[0].id,
        select = $('#trip_' + productId);
        if(select[0].checkValidity()){
			Session.set('tripId',select.val());
			if(!isCustomer()){
				Meteor.Router.to("/bookOperator/" + $(event.currentTarget).parents('li')[0].id);
			}				
			else{
				Session.set('productId', productId);
				Session.set('dateSelected', true);
				formBook();
			}
				
		}else{
            showPopover(select, 'Choose the trip');
        }
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
	}
}
///////////////////////////////////////////
//Template Book Detail
Template.bookDetail.rendered = function() {
	var oTable = $('#passengers').dataTable();
	oTable.fnSort( [ [7,'asc'] ] );
	$('#boatSlots').dataTable();
	countExtraSpace();
	drawPieChartBoatSlots();
	returnPersons();
}

Template.bookDetail.fullname = function(id){
	return Customers.findOne({_id: id}).fullName;
}

Template.bookDetail.telephone = function(id){
	return Customers.findOne({_id: id}).telephone;
}

Template.bookDetail.totalPassagers = function(id){
	var persons = 0;
	book = Books.findOne({_id : id});
	for (var i = 0; i < book.prices.length; i++) {
		persons = parseInt(persons + parseInt(book.prices[i].persons));
	};
	return persons;
}

Template.bookDetail.totalPersons = function(){
	var dates = getSelectedAndNextDay();
	var trip = Trips.findOne(Session.get('tripId'));
	
	var persons = 0;

	books = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Created'
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		for (var j = 0; j < books[i].prices.length; j++) {
			persons = parseInt(persons + parseInt(books[i].prices[j].persons));
		};
	};

	return persons;
}

Template.bookDetail.qtdCarsUpTo5 = function(){
	return carsUpTo5();
}

Template.createBook.qtdCarsUpTo5 = function(){
	return carsUpTo5();
}

Template.createBook.dateSelected = function(){
	return !Session.get('dateSelected');
}

Template.generalPassagerInfo.dateSelected = function(){
	console.log('aqui');
	return !Session.get('dateSelected') && !Session.get('creatingUser');
}

carsUpTo5 = function(){
	var dates = getSelectedAndNextDay();
	var trip = Trips.findOne(Session.get('tripId'));
	
	var count = 0;

	books = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
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
	return carsUpto6();
}

Template.createBook.qtdCarsUpTo6 = function(){
	return carsUpto6();
}

var returnPersons = function(){
	var dates = getSelectedAndNextDay();
	var trip = Trips.findOne(Session.get('tripId'));

	var adults = 0;
	var childrens = 0;
	var infants = 0;
	var seniors = 0;
	var schoolDiscount = 0;
	var guidesAndDrivers = 0;

	books = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Created',
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		for (var j = 0; j < books[i].prices.length; j++) {
			if(books[i].prices[j].price == 'Adult'){
				adults = parseInt(adults + parseInt(books[i].prices[j].persons));
			}
			if(books[i].prices[j].price == 'Child'){
				childrens = parseInt(childrens + parseInt(books[i].prices[j].persons));
			}
			if(books[i].prices[j].price == 'Infant'){
				infants = parseInt(infants + parseInt(books[i].prices[j].persons));
			}
			if(books[i].prices[j].price == 'Senior'){
				seniors = parseInt(seniors + parseInt(books[i].prices[j].persons));
			}
			if(books[i].prices[j].price == 'School Discount'){
				schoolDiscount = parseInt(schoolDiscount + parseInt(books[i].prices[j].persons));
			}
			if(books[i].prices[j].price == 'Guides and Drivers'){
				guidesAndDrivers = parseInt(guidesAndDrivers + parseInt(books[i].prices[j].persons));
			}
		};
	};

	$('#numberOfAdults').text(adults);
	$('#numberOfChildrens').text(childrens);
	$('#numberOfInfants').text(infants);
	$('#numberOfSeniors').text(seniors);
	$('#numberOfSchoolDiscount').text(schoolDiscount);
	$('#numberOfGuideAndDrivers').text(guidesAndDrivers);

}

Template.createBook.numbersOfChildren = function(){
	return carsUpto6();
}

Template.bookDetail.numbersOfInfants = function(){
	return carsUpto6();
}

Template.createBook.numberOfSeniors = function(){
	return carsUpto6();
}

Template.bookDetail.schoolDiscount = function(){
	return carsUpto6();
}

Template.createBook.numbersOfGuidesAndDrivers = function(){
	return carsUpto6();
}

carsUpto6 = function(){
	var dates = getSelectedAndNextDay();
	var trip = Trips.findOne(Session.get('tripId'));
	var count = 0;

	books = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
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

var formBook = function(){
	Session.set("isEditing", false);
	Session.set("firstTime", false);
	Session.set("categoryId", null);
	var bookingsCreated = Books.find({dateOfBooking: new Date(localStorage.getItem('date')), 'product._id': Session.get('productId'), bookStatus: 'Created'});
	if(bookingsCreated.length >= MaxCapacity)
		throwError('Maximum capacity of passengers reached!');	
	else
		Meteor.Router.to("/bookOperator/" + Session.get('productId') + '/new');
}

//Global Vars
var MaxCapacity = 0;

Template.bookDetail.events({
	'click #newBooking' :function(event) {
		formBook();
	},

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
		date = new Date(localStorage.getItem('date'));
		return date.toLocaleDateString();
	},

	bookings : function(){
		var date = new Date(localStorage.getItem('date')),
		trip = Trips.findOne(Session.get('tripId')),
		currentDate = new Date(localStorage.getItem('date'));

		with(date){
			setDate(getDate() + 1);
		}

		return Books.find({
			dateOfBooking 	: {$gte: currentDate, $lt: date},
			'product._id' 	: Session.get('productId'),
			'trip._id' 	: trip._id
		});
	},

	isBookCreated : function(status) {
		return status == 'Created';
	},

	isBookingNotFull: function(totalPersons, boatCapacity) {
		var isValidDate = true,
		selectedDate = new Date(localStorage.getItem('date'));
		date = new Date();
		
		with(date){
			setHours(0);
			setMinutes(0);
			setSeconds(0);
			setMilliseconds(0);
		}

		if(selectedDate < date)
			isValidDate = false;

		return (totalPersons < boatCapacity) && isValidDate;
	},

	bookingsCreated : function(){
		return Books.find({dateOfBooking: new Date(localStorage.getItem('date')), 'product._id': Session.get('productId'), bookStatus : "Created"});
	}
});

///////////////////////////////////////////
//Template Create Book
Template.createBook.productName = function(){
	return Session.get("productId") ? Products.findOne({_id: Session.get("productId")}).name : "" ;
}

Template.createBook.currentSeason = function(){
	return currentSeason();
}

Template.createBook.dateOfBooking = function(){
	return new Date(localStorage.getItem('date')).toLocaleDateString();
}

Template.createBook.booked = function(from,to){
	if(Session.get('isEditing')){
		if (book.trip.from == from && book.trip.to == to) {
			return true;
		}else{
			return false;
		};	
	}return false;
}

Template.generalPassagerInfo.isEditing = function(){
	return Session.get('isEditing');
}

Template.generalPassagerInfo.isCreatingExternalUser = function(){
	return Session.get('creatingUser');
}


Template.productPrices.priced = function(price){
	if(Session.get('isEditing')){
		return _priced(price);
	}else{
		return 0;
	}
}

Template.productPrices.firstTime = function(){
	return Session.get('firstTimePrice') ? true : false;
}

Template.productPrices.firstTimePricing = function(price, unit){
	if(Session.get('isEditing')){
		var parcialTotal = _priced(price) * unit;
		calcTotal();
		return parcialTotal;
	}else{
		return 0;
	}
}

var _priced = function(price){
	for (var i = book.prices.length - 1; i >= 0; i--) {
		if(price == book.prices[i].prices){
			return book.prices[i].persons;
		};
	};
	return 0;
}

Template.categoryVehicleBook.sizes = function() {
	return Session.get('categoryId') ? VehiclesCategory.findOne({_id: Session.get('categoryId')}).size : [];
}

Template.categoryVehicleBook.firstTime = function(){
	return Session.get('firstTime') ? true : false;
}

Template.createBook.trips = function(){
	if(Session.get('isEditing')){
		if(Session.get("productId")){
			return Trips.find({productId : Session.get("productId"), active : true})
		}else{
			throwError('Something Bad Happened, Try Again');
			return [];
		}
	}else{
		return Trips.find({_id : Session.get("tripId")});
	}
}


Template.createBook.helpers({
	"prices" : function(){
		if(Session.get("productId")){
			return Prices.find({productId : Session.get("productId"), active : true, season: currentSeason()})
		}else{
			throwError('Something Bad Happened, Try Again');
			return [];
		}
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
	$('#pasagerInfo').on('submit', function(event){
		event.preventDefault();
	});
	if(Session.get('isEditing')){
		var customer = Customers.findOne({_id: Session.get("customerId")});

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
	}

	$('#passengers').dataTable();
	$('#boatSlots').dataTable();
	countExtraSpace();
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
		Session.set('firstTimePrice', false);
		var totalParcial = event.currentTarget.value * this.unit;
		$('#'+this._id).val(totalParcial).text(totalParcial);
		var totalPrice = event.currentTarget.value;
		var totalParcial = totalPrice * this.unit;
		$('#'+this._id).val(totalParcial);
		$('#'+this.unit).val(this.price+"|"+this.unit+"|"+totalPrice+"|"+totalParcial);

		calcTotal();
	}
})

Template.generalPassagerInfo.events({
	'keyup #fullName' : function(event){
		if(event.keyCode != 13 && CustomerSelected)
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
	    	CustomerSelected = false;
			SaveCustomer = true;
		}
	},
	
	//Events for identify 
	'click .addBook' : function(event){
		if($("#categories").val() != "" && $("#size").val() == "" && !$('#size').is(':disabled')){
			throwError('Please Inform the size of vehicle');
		}else if(!CanSaveTheBook){
			throwError("The Vehicle informed can't go on the boat");
		}else{
			var form = document.getElementById('pasagerInfo');
			if(form.checkValidity()){
				createBook();
				throwSuccess("Book added on Cart");
				Meteor.Router.to('/bookOperator');
			}else{
				$('#pasagerInfo').submit(function(event){
					event.preventDefault();
				});
			}
		}
	},

	'click .saveEdit' : function(event){
		if($("#categories").val() != "" && $("#size").val() == "" && !$('#size').is(':disabled')){
			throwError('Please Inform the size of vehicle');
		}else if(!CanSaveTheBook){
			throwError("The Vehicle informed can't go on the boat");
		}else{
			var form = document.getElementById('pasagerInfo');
			if(form.checkValidity()){
				createBook();
				throwSuccess("Book updated");
				Meteor.Router.to('/overview');
			}else{
				$('#pasagerInfo').submit(function(event){
					event.preventDefault();
				});
			}
		}
	},

	'click .procedToCart' : function(event){
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
			}else{
				$('#pasagerInfo').submit(function(event){
					event.preventDefault();
				});
			}
		}
	},

	'click .createUser' : function(event){
		event.preventDefault();
		if($("#firstPasswordToEnter").val() != $("#confirmPassword").val()){
			throwError('Passwords must match');
			return;
		}
		var customerData = {
			'fullName' :  $('#fullName').val(),
			'title' : $('#title').val(),
	    	'birthDate': $('#birthDate').val(),
	    	'email' : $('#email').val(),
	    	'telephoneCode' : $('#telephoneCode').val(),
	    	'telephone' : $('#telephone').val(),
	    	'adress' : $('#adress').val(),
	    	'city' : $('#city').val(),
	    	'state' : $('#state').val(),
	    	'postcode' : $('#postcode').val(),
	    	'country' : $('#country').val()
		}

		var user = {
			username : $('#email').val(),
			email : $('#email').val(),
			password : $('#password').val()
		}
		Meteor.call('createExternalAccount', user, customerData, function(err, result){
			if(err){
				throwError("Email already registered!");
			}else{
				throwSuccess("Successfuly registered!");
				Meteor.Router.to('/');
			}
		})
	},

	'change #myOwnData' : function(event){
		event.preventDefault();
		if($("#usingData").val() == 'false'){
			$("#usingData").val('true');
			$('#fullName').val(Meteor.user().profile.name);
			$('#customerId').val(Meteor.user().profile.customerId);
			var currentCustomer = Customers.findOne({'_id' : Meteor.user().profile.customerId});
			$('#title').val(currentCustomer.title)
	    	$('#birthDate').val(currentCustomer.birthDate);
	    	$('#email').val(currentCustomer.email);
	    	$('#telephoneCode').val(currentCustomer.telephoneCode);
	    	$('#telephone').val(currentCustomer.telephone);
	    	$('#adress').val(currentCustomer.adress);
	    	$('#city').val(currentCustomer.city);
	    	$('#state').val(currentCustomer.state);
	    	$('#postcode').val(currentCustomer.postcode);
	    	$('#country').val(currentCustomer.country);
		}else{
			$("#usingData").val('false');
			$('#fullName').val('');
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
		}
	}


})

Template.generalPassagerInfo.customerCreation = function(){
	if(Meteor.user()){
		return isCustomer();
	}else{
		return false;
	}
}

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
      	changeYear 	: true
	});

	$('#telephone').mask('(999) 99999999');
	$('#birthDate').mask('99/99/9999');
	loadTypeAheadPostCodes();
}

Template.bookingVehicles.rendered = function(){
	$('#vehicle').typeahead('destroy');
	var items = [],
	finalItems,
	tags = Vehicles.find({}, {fields: {vehicleName: 1}});
	tags.forEach(function(tag){
    	var datum = {
    		'value' : tag.vehicleName,
    		'id' : tag._id
    	}
    	items.push(datum);
	});

	finalItems = _.uniq(items);

	$('#vehicle').typeahead({
		name : 'name',
		local: finalItems
	}).bind('typeahead:selected', function (obj, datum) {
		var id = datum.id;
		if(id != ""){
			var vehicle = Vehicles.findOne({_id: id});

			$("#categories option").filter(function(){
				return $(this).text() == vehicle.category;
			}).attr('selected', true);

			$('#vehiclePlate').val(vehicle.vehiclePlate);

			var category = VehiclesCategory.findOne({category: vehicle.category});
			VehicleSelected = true;

			$("#size option").filter(function(){
				return $(this).text() == vehicle.size;
			}).attr('selected', true);

			if(category.vehiclePlate){
				SaveVehicle = false;
			}else{
				SaveVehicle = true;
			}T

			Session.set('categoryId', category._id);
			
			$("#totalVehicle").text(vehicle.totalCost);
			calcTotal();
		}else{
			VehicleSelected = false;
			SaveVehicle = true;
			calcTotal();
		}
	});
}

Template.bookingVehicles.events({
	'keyup #vehicle' : function(event){
		if(event.keyCode != 13 && VehicleSelected){
			$("#categories").removeAttr("disabled");
			$("#size").removeAttr("disabled");
			$("#categories option:first").attr("selected", true);
			$("#size option:first").text("").attr("selected", true);
			$("#size option:first").attr("selected", true);
			$('#vehiclesField input[type=text]').val('');
			$('#vehiclePlate').val("");
			VehicleSelected = false;
			calcTotal();
		}
	}
})

Template.categoryVehicleBook.helpers({
	categories : function(){
		return VehiclesCategory.find();
	}
});

Template.categoryVehicleBook.categorized = function(_category){;
	if(Session.get('firstTime')){
		if(_category == book.vehicle.category){
			var objCategory =  VehiclesCategory.findOne({category : _category});
			Session.set('categoryId',objCategory._id);
			Template.categoryVehicleBook.sizes();
			return true;
		}else{
			return false;
		}
	}if (Session.get('isEditing')) {
		if(_category == VehiclesCategory.findOne({_id : Session.get('categoryId')}).category){
			Template.categoryVehicleBook.sizes();
			return true;
		}else{
			return false;
		}
	}
	else{
		return false;
	}
}

Template.categoryVehicleBook.rendered = function(){
	calcVehiclePrice(Session.get('currentSizeCar'));
	calcTotal();
}


Template.categoryVehicleBook.isBaseSize = function(number) {
	category =  Session.get('categoryId') ? VehiclesCategory.findOne({_id: Session.get('categoryId')}) : null;
	if(number == category.baseSize){	
		return true;
	}else{
		return false;
	}
}

Template.categoryVehicleBook.sized = function(number) {
	if (number == book.vehicle.size){
			Session.set('currentSizeCar', number);
			calcVehiclePrice(number);
			calcTotal();
			return true;
		}else{
			return false;
		}

}	

Template.categoryVehicleBook.events({
	'change #categories' : function(event){
		
		var id = event.target.selectedOptions[0].id;
		var category = VehiclesCategory.findOne({_id: id});
		if(category){
			$("#baseVehicle").val(parseInt(category.basePrice));
			$("#totalVehicle").text(parseInt(category.basePrice));
			Session.set('categoryId', id);
			checkIfCarsFits(category.baseSize);
		}else{
			$("#baseVehicle").val(0);
			$("#totalVehicle").text(0);
			Session.set('categoryId', null);
		}
		
		calcTotal();
		changeSizes();
		Session.set("firstTime", false);
	},

	'change #size' : function(event){
		
		var value = event.target.selectedOptions[0].value;
		Session.set('currentSizeCar', value);
		calcVehiclePrice(value);
		checkIfCarsFits(value);
		calcTotal();

		Session.set("firstTime", false);
	}
})

changeSizes = function(){
	category = Session.get('categoryId') ? VehiclesCategory.findOne({_id: Session.get('categoryId')}) : null;
	if(category){
		Template.categoryVehicleBook.sizes();
	}
}

calcVehiclePrice = function(value){
	category = Session.get('categoryId') ? VehiclesCategory.findOne({_id: Session.get('categoryId')}) : null;
	if(category){
		
		var base = category.basePrice;
		sum = parseInt(value - category.baseSize);
		if(sum < 0 && category.onReduce){
			multFactor = sum * (-1);
			totalToBeReduced = multFactor * category.step;
			$("#totalVehicle").text(parseInt(base - totalToBeReduced));
		}else if(sum > 0){
			totalToBeAdded = sum * category.step;
			$("#totalVehicle").text(parseInt(base + totalToBeAdded));
		}else{
			$("#totalVehicle").text(parseInt(base));
		}
	}
}

calcTotal = function(){
	var total = 0;
	$('.calcTotal').filter(function(){
		if($(this).text() != "")
		total += parseInt($(this).text());
	})

	$('#totalISK').text(total);
}

loadTypeAheadPostCodes = function(){
	$('#postcode').typeahead('destroy');
	var postCodes = [],
	finalPostCodes,
	postTags = PostCodes.find({}, {fields: {postcode: 1, city: 1}});

	postTags.forEach(function(tag){
    	var datum = {
    		'value' : tag.postcode,
    		'id' : tag._id,
    		'city' : tag.city
    	}
    	postCodes.push(datum);
	});

	finalPostCodes = _.uniq(postCodes);

	$('#postcode').typeahead({
		name : 'postcode',
		local : finalPostCodes
	}).bind('typeahead:selected', function (obj, datum) {
    	$('#city').val(datum.city);
	});
}

loadTypeahead = function(){
	if(!isCustomer()){
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
    	CustomerSelected = true;
	});
	}


	$('#vehicleSearch').typeahead('destroy');

	var callback = function(data){
		var datums = [];
		for (var i = 0; i < data.length; i++) {
			var datum = {
				'value' : data[i].brandname + ' ' +data[i].model+ ' ' + data[i].modelTrim + ' ' + data[i].modelYear,
				'brandname' : data[i].brandname,
				'model' : data[i].model,
				'modelBody' : data[i].modelBody,
				'weight' : data[i].weight,
				'length' : data[i].length,
				'width' : data[i].width,
				'height' : data[i].height,
				'id' : data[i]._id
			}

			datums.push(datum);
		};

		$('#vehicleSearch').typeahead({
			name : 'model',
			local : datums,
			minLength: 3
		}).bind('typeahead:selected', function (obj, datum) {
			$('#vehicle').val(datum.value);
		    $('#vehicleModelBody').val(datum.modelBody ? datum.modelBody : 'Not Found');
			$('#vehicleWeight').val(datum.weight ? datum.weight+'Kg' : 'Not Found')
			$('#vehicleLength').val(datum.length ? datum.length/1000+"m" : 'Not Found')
			$('#vehicleWidth').val(datum.width ? datum.width/1000+"m" : 'Not Found')
			$('#vehicleHeight').val(datum.height ? datum.height/1000+"m" : 'Not Found')
		});

		$('#loading').hide();
		$('#searchVehicleLegend').append("<i class='icon-search'></i>");
	}

	Meteor.call('getAllCars', function(err, data) {
        callback(data);
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

	var date = new Date();
	var selectedDay = new Date(localStorage.getItem('date'));

	with(date){
		setDate(selectedDay.getDate());
	}


	var trip = Trips.findOne(Session.get('tripId'));

		book = {
		"trip" : {
			'_id'	: Session.get('tripId'),
			'from' 	: trip.from,
			'to' 	: trip.to,
			'hour' 	: trip.hour
		},
		"totalISK" : $("#totalISK").text(),
		'dateOfBooking' : date,
		'bookStatus' : 'Created',
		'product' : (isCustomer()) ? Products.findOne(Session.get('productId')) : Product,
	}

	vehicle = {
		"vehicleName" : $("#vehicle").val(),
		"category" : $("#categories").val(),
		"size" : $("#size").val(),
		"totalCost" : $("#totalVehicle").text(),
		'vehiclePlate' : $('#vehiclePlate').val()
	}

	book.vehicle = vehicle;

	



	if(ExtraSlot){
		book.vehicle.extraSlot = ExtraSlot;
	}else{
		book.vehicle.extraSlot = extraSlots[0];
	}

	if(isCustomerLogged()){
		book.customerId = Meteor.user().profile.customerId;
	}else{
		if(SaveCustomer){
			var resultId = Customers.insert(customer);
			book.customerId = resultId;
		}else{
			book.customerId = $('#customerId').val();
		}
	}

	

	if(SaveVehicle){
		Vehicles.insert(vehicle);
	}
	

	var prices = [];

	$('.unitPrice').filter(function(){
		var split = $(this).val().split("|");
		if(split[2]){
			var price = {
			"price" : split[0],
			"perUnit" : split[1],
			"persons" : split[2],
			"sum" : split[3]
			}
			
			prices.push(price);
		}
	});
	
	book.prices = prices;
	book.paid = false;
	if (Session.get("isEditing")) {
		Books.update(book._id, {$set : {
			"dateOfBooking" : book.dateOfBooking,
			"prices" : book.prices,
			"totalISK": book.totalISK,
			"trip.from" : book.trip.from,
			"trip.to" : book.trip.to,
			"trip.hour" : book.trip.hour,
			"vehicle.category" : book.vehicle.category,
			"vehicle.extraSlot" : book.vehicle.extraSlot,
			"vehicle.size" : book.vehicle.size,
			"vehicle.totalCost" : book.vehicle.totalCost,
			"vehicle.vehicleName" : book.vehicle.vehicleName,
			"vehicle.vehiclePlate" : book.vehicle.vehiclePlate
		}});
		var note = $('#notes').val();
		if(note){
			var note = {
				created : date,
				type : 'Customer Note',
				note : note,
				bookId : book._id
			}

			Notes.insert(note);
		}
	}else{

		if(!isCustomer()){
			temporaryID = CartItems.insert(book);
			var note = $('#notes').val();
			if(note){
				var note = {
					created : date,
					type : 'Customer Note',
					note : note,
					bookId : temporaryID
				}

				Notes.insert(note);
			}
		}else{
			CBasket.insert(book);
		}
			
	};	
}


var formatData = function(percentages){
	var data = {
	    pieChart  : [
	      {
	        color       : 'red',
	        description : '5 meters cars',
	        title       : 'Small Cars (5m)',
	        value       : parseFloat(percentages.percentage5m / 100)
	      },
	      {
	        color       : 'blue',
	        description : '6 meters cars',
	        title       : 'trains',
	        value       : parseFloat(percentages.percentage6m / 100)
	      },
	      {
	        color       : 'green',
	        description : 'Extra Slots Cars',
	        title       : 'trains',
	        value       : parseFloat(percentages.percentageLargeCars / 100)
	      },
	      {
	        color       : 'gray',
	        description : 'Unallocated Space',
	        title       : 'trains',
	        value       : parseFloat(percentages.percentageUnllocated / 100)
	      }
	    ]
  	};

  return data;
}

    

  
  var DURATION = 1500;
  var DELAY    = 500;



function drawPieChart( elementId, data ) {
    // TODO code duplication check how you can avoid that
    var count = 0;
    var y = 0;
    var y2 = 0;
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
                              drawDetailedInformation( d.data, this, count++); 
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
    
    function drawDetailedInformation ( data, element, count) {
      var bBox      = element.getBBox(),
          infoWidth = width * 0.3,
          anchor,
          infoContainer,
          position,
          y;
          var color = "";
         y = parseInt(count * 50 + 15);

         if(count == 0){
         	color = '#d15b47';
         }

         if(count == 1){
         	color = '#6fb3e0';
         }

         if(count == 2){
         	color = '#87b87f';
         }

         if(count == 3){
         	color = '#808080';
         }


       
    	infoContainer = detailedInfo.append( 'g' )
            .attr( 'width', infoWidth )
            .attr(
              'transform',
              'translate(' + 0 + ',' + y + ')'
            );
        anchor   = 'start';
        position = 'left';
        
    	
    

      infoContainer.data( [ data.value * 100 ] )
                    .append( 'text' )
                    .text ( '0 %' )
                    .attr( 'class', 'pieChart--detail--percentage' )
                    .attr( 'x', ( position === 'left' ? 0 : infoWidth ) )
                    .attr( 'y', 0 )
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
                    .html('<div class="line"><div style="width:10px;height:10px;border:1px solid #000; background-color: '+color+'"></div>'+data.description+'</div>');

		          
    }
  }

function drawPieChartBoatSlots() {
    drawPieChart('pieChart', formatData(updateDataPieChart()).pieChart );
}

var checkIfCarsFits = function(size){
	var trip = Trips.findOne(Session.get('tripId'));
	ExtraSlot = null;
	CanSaveTheBook = true;
	if(size <= 6){
		//Check if all space on the boat for the cars has takken, if yes
		//will ask to operator if him wants to open the door for place the cars
		showAlert = checkHaveToOpenDoor(size, trip);

		//If the door has reached the max capacity, there is no space on the boat for the
		//car based on his size
		maxCapacity = doorMaxCapacity(trip);

		if(showAlert){
			var result = confirm("There is no space on the boat. Place on the Door?");
			if(result){
				ExtraSlot = extraSlots[0];
				CanSaveTheBook = true;
			}else{
				if(!isCustomer())
					result = confirm("Wishes to put on extra slot?");
				else
					result = true;
				if(result){
					fits = checkSpaceExtra(size, trip);
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
		}else if(size <= 2.5 && CanAdd2Motocycle){
			ExtraSlot = extraSlots[0];
			CanSaveTheBook = true;
		}else if(maxCapacity){
			if(!isCustomer())
				result = confirm("The Door is already full, place the car on extra slots?");
			else
				result = true;
			if(result){
				fits = checkSpaceExtra(size, trip);
				if(fits){
					ExtraSlot = fits;
					CanSaveTheBook = true;
				}else{
					alert("This car can't be on the boat, this booking can't be created!");
					CanSaveTheBook = false;
				}
			}
		}
	}else if(size > 6){
		if(!isCustomer())
			result = confirm("Place this car on Extra Slot?");
		else
			return true;
		if(result){
			fits = checkSpaceExtra(size, trip);
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
}
